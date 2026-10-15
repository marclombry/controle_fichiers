'use strict';

const $ = (id) => document.getElementById(id);

const state = {
  file: null,
  kind: null,
  workbook: null,
  headers: [],
  rows: [],
  parseIssues: [],
  delimiter: ';',
  issues: [],
  dataLineNumbers: []
};

const countryPatterns = {
  FR: { regex: /^\d{5}$/, label: '5 chiffres' },
  BE: { regex: /^\d{4}$/, label: '4 chiffres' },
  DE: { regex: /^\d{5}$/, label: '5 chiffres' },
  ES: { regex: /^\d{5}$/, label: '5 chiffres' },
  IT: { regex: /^\d{5}$/, label: '5 chiffres' },
  NL: { regex: /^\d{4}\s?[A-Z]{2}$/i, label: '4 chiffres suivis de 2 lettres (ex. 1234 AB)' },
  PT: { regex: /^\d{4}-\d{3}$/, label: 'format 0000-000' },
  CH: { regex: /^\d{4}$/, label: '4 chiffres' },
  LU: { regex: /^\d{4}$/, label: '4 chiffres' },
  US: { regex: /^\d{5}(?:-\d{4})?$/, label: '5 chiffres ou ZIP+4 (ex. 12345-6789)' },
  CA: { regex: /^[A-Z]\d[A-Z][ -]?\d[A-Z]\d$/i, label: 'format canadien (ex. A1A 1A1)' },
  GB: { regex: /^(?:GIR\s?0AA|(?:[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}))$/i, label: 'format postal britannique (ex. SW1A 1AA)' },
  IE: { regex: /^(?:[A-Z]\d{2}\s?[A-Z0-9]{4}|D6W\s?[A-Z0-9]{4})$/i, label: 'format Eircode (ex. D02 X285)' },
  AU: { regex: /^\d{4}$/, label: '4 chiffres' }
};

const countryAliases = {
  FR: ['FR', 'FRA', 'FRANCE', 'FRANCAISE', 'FRANCAIS'],
  BE: ['BE', 'BEL', 'BELGIQUE', 'BELGIUM'],
  DE: ['DE', 'DEU', 'GERMANY', 'ALLEMAGNE', 'DEUTSCHLAND'],
  ES: ['ES', 'ESP', 'ESPAGNE', 'SPAIN', 'ESPANA'],
  IT: ['IT', 'ITA', 'ITALIE', 'ITALY'],
  NL: ['NL', 'NLD', 'PAYS BAS', 'NETHERLANDS', 'HOLLAND'],
  PT: ['PT', 'PRT', 'PORTUGAL'],
  CH: ['CH', 'CHE', 'SUISSE', 'SWITZERLAND', 'SCHWEIZ'],
  LU: ['LU', 'LUX', 'LUXEMBOURG'],
  US: ['US', 'USA', 'UNITED STATES', 'ETATS UNIS', 'ETATSUNIS', 'AMERICA'],
  CA: ['CA', 'CAN', 'CANADA'],
  GB: ['GB', 'GBR', 'UK', 'UNITED KINGDOM', 'ROYAUME UNI', 'GREAT BRITAIN'],
  IE: ['IE', 'IRL', 'IRELAND', 'IRLANDE'],
  AU: ['AU', 'AUS', 'AUSTRALIA', 'AUSTRALIE']
};

const countryNames = {
  FR: 'France',
  BE: 'Belgique',
  DE: 'Allemagne',
  ES: 'Espagne',
  IT: 'Italie',
  NL: 'Pays-Bas',
  PT: 'Portugal',
  CH: 'Suisse',
  LU: 'Luxembourg',
  US: 'États-Unis',
  CA: 'Canada',
  GB: 'Royaume-Uni',
  IE: 'Irlande',
  AU: 'Australie'
};

const countryAliasLookup = Object.fromEntries(
  Object.entries(countryAliases).flatMap(([code, aliases]) =>
    aliases.map(alias => [normalizeCountryToken(alias), code])
  )
);

$('fileInput').addEventListener('change', (event) => {
  if (event.target.files[0]) loadFile(event.target.files[0]);
});

$('dropzone').addEventListener('dragover', (event) => {
  event.preventDefault();
  $('dropzone').classList.add('dragover');
});

$('dropzone').addEventListener('dragleave', () => {
  $('dropzone').classList.remove('dragover');
});

$('dropzone').addEventListener('drop', (event) => {
  event.preventDefault();
  $('dropzone').classList.remove('dragover');
  if (event.dataTransfer.files[0]) loadFile(event.dataTransfer.files[0]);
});

$('sheetSelect').addEventListener('change', () => loadSheet($('sheetSelect').value));

$('delimiter').addEventListener('change', () => {
  if (state.file && state.kind !== 'xlsx') parseTextFile();
});

$('runButton').addEventListener('click', runChecks);
$('resetButton').addEventListener('click', resetApp);
$('exportButton').addEventListener('click', exportReport);

async function loadFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();

  if (!['csv', 'txt', 'xlsx'].includes(ext)) {
    return showStatus('Format non pris en charge. Choisissez un fichier CSV, TXT ou XLSX.', true);
  }

  state.file = file;
  state.kind = ext;
  state.parseIssues = [];
  state.issues = [];

  $('resultsPanel').classList.add('hidden');
  $('statusMessage').textContent = '';
  $('fileInfo').classList.remove('hidden');
  $('fileInfo').textContent = `📄  ${file.name} · ${formatBytes(file.size)}`;
  $('resetButton').disabled = false;
  $('sheetRow').classList.toggle('hidden', ext !== 'xlsx');

  document.querySelectorAll('.csv-only').forEach(element => {
    element.classList.toggle('hidden', ext === 'xlsx');
  });

  if (ext === 'xlsx') {
    if (!window.XLSX) {
      return showStatus('La bibliothèque XLSX ne s’est pas chargée. Vérifiez la connexion Internet puis rechargez la page.', true);
    }

    try {
      const bytes = await file.arrayBuffer();
      state.workbook = XLSX.read(bytes, { type: 'array', cellDates: false });

      $('sheetSelect').innerHTML = '';

      state.workbook.SheetNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        $('sheetSelect').append(option);
      });

      loadSheet(state.workbook.SheetNames[0]);
    } catch (error) {
      showStatus('Impossible de lire ce fichier XLSX. Vérifiez qu’il n’est pas endommagé.', true);
    }
  } else {
    state.workbook = null;
    $('delimiter').disabled = false;
    parseTextFile();
  }
}

function loadSheet(name) {
  const sheet = state.workbook?.Sheets[name];
  if (!sheet) return;

  const matrix = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    raw: false,
    blankrows: false
  });

  setMatrix(matrix, false);
}

function parseTextFile() {
  if (!state.file) return;

  const reader = new FileReader();

  reader.onload = () => {
    const content = String(reader.result || '').replace(/^\uFEFF/, '');
    const chosen = $('delimiter').value;
    const detected = chosen === 'auto'
      ? detectDelimiter(content)
      : chosen === 'tab'
        ? '\t'
        : chosen;

    state.delimiter = detected;

    const parsed = parseDelimited(content, detected);
    state.parseIssues = parsed.issues;

    setMatrix(
      parsed.records.map(record => record.cells),
      true,
      parsed.records.map(record => record.line)
    );
  };

  reader.onerror = () => showStatus('Impossible de lire ce fichier.', true);
  reader.readAsText(state.file, 'UTF-8');
}

function detectDelimiter(text) {
  const sample = text.split(/\r?\n/, 8).filter(Boolean).join('\n');
  const candidates = [';', ',', '\t', '|'];
  let best = ';';
  let score = -1;

  for (const delimiter of candidates) {
    const parsed = parseDelimited(sample, delimiter).records;
    const widths = parsed.map(record => record.cells.length);
    const average = widths.reduce((a, b) => a + b, 0) / Math.max(widths.length, 1);
    const consistency = widths.filter(width => width === widths[0]).length / Math.max(widths.length, 1);
    const candidateScore = average > 1 ? average * consistency : 0;

    if (candidateScore > score) {
      score = candidateScore;
      best = delimiter;
    }
  }

  return best;
}

function parseDelimited(text, delimiter) {
  const records = [];
  const issues = [];

  let cells = [];
  let value = '';
  let quoted = false;
  let afterQuote = false;
  let line = 1;
  let recordLine = 1;

  const pushCell = () => {
    cells.push(value);
    value = '';
    afterQuote = false;
  };

  const pushRecord = () => {
    pushCell();
    records.push({ cells, line: recordLine });
    cells = [];
    recordLine = line;
  };

  for (let i = 0; i < text.length; i++) {
    const character = text[i];

    if (quoted) {
      if (character === '"' && text[i + 1] === '"') {
        value += '"';
        i++;
      } else if (character === '"') {
        quoted = false;
        afterQuote = true;
      } else {
        value += character;
        if (character === '\n') line++;
      }

      continue;
    }

    if (character === '"') {
      if (value.length === 0 && !afterQuote) {
        quoted = true;
      } else {
        issues.push({
          line,
          col: cells.length + 1,
          detail: 'Guillemet ouvrant au milieu d’une valeur non encadrée.'
        });
        value += character;
      }
    } else if (character === delimiter) {
      pushCell();
    } else if (character === '\r' || character === '\n') {
      if (character === '\r' && text[i + 1] === '\n') i++;
      pushRecord();
      line++;
      recordLine = line;
    } else {
      if (afterQuote && !/[ \t]/.test(character)) {
        issues.push({
          line,
          col: cells.length + 1,
          detail: 'Caractère inattendu après le guillemet fermant.'
        });
      }

      value += character;
    }
  }

  if (quoted) {
    issues.push({
      line: recordLine,
      col: cells.length + 1,
      detail: 'Guillemet non fermé avant la fin du fichier.'
    });
  }

  if (value.length || cells.length || (text.length && !/[\r\n]$/.test(text))) {
    pushRecord();
  }

  return { records, issues };
}

function setMatrix(matrix, isText, lines = []) {
  while (
    matrix.length &&
    matrix[matrix.length - 1].every(value => String(value ?? '').trim() === '')
  ) {
    matrix.pop();
  }

  if (!matrix.length) {
    state.headers = [];
    state.rows = [];
    return showStatus('Le fichier est vide.', true);
  }

  state.headers = matrix[0].map((header, index) =>
    String(header ?? '').trim() || `Colonne ${index + 1}`
  );

  state.rows = matrix.slice(1).map(row =>
    state.headers.map((_, index) => String(row?.[index] ?? ''))
  );

  state.dataLineNumbers = state.rows.map((_, index) =>
    isText ? (lines[index + 1] || index + 2) : index + 2
  );

  if (isText) {
    const widths = matrix.map(row => row.length);
    const expected = widths[0];

    for (let i = 1; i < widths.length; i++) {
      const rowHasContent = matrix[i].some(value => String(value ?? '').trim() !== '');

      if (widths[i] !== expected && rowHasContent) {
        state.parseIssues.push({
          line: lines[i] || i + 1,
          col: '—',
          detail: `La ligne contient ${widths[i]} colonne(s), contre ${expected} dans l’en-tête.`
        });
      }
    }
  } else {
    state.parseIssues = [];
  }

  fillColumnSelects();
  $('runButton').disabled = false;
  $('delimiter').disabled = !isText;

  showStatus(`${state.rows.length} ligne(s) de données détectée(s).`);
}

function fillColumnSelects() {
  const postal = $('postalColumns');
  const required = $('requiredColumns');
  const countryColumn = $('countryColumn');

  postal.innerHTML = '';
  required.innerHTML = '';
  countryColumn.innerHTML = '';

  const fixedOption = document.createElement('option');
  fixedOption.value = 'fixed';
  fixedOption.textContent = 'Utiliser le pays de référence ci-dessus';
  countryColumn.append(fixedOption);

  state.headers.forEach((header, index) => {
    const label = `${header} (col. ${index + 1})`;

    const postalOption = document.createElement('option');
    postalOption.value = index;
    postalOption.textContent = label;
    postal.append(postalOption);

    const requiredOption = document.createElement('option');
    requiredOption.value = index;
    requiredOption.textContent = label;
    required.append(requiredOption);

    const countryOption = document.createElement('option');
    countryOption.value = index;
    countryOption.textContent = label;
    countryColumn.append(countryOption);

    if (isPostalHeader(header)) postalOption.selected = true;

    if (/nom|name|adresse|address|postal|ville|city|email|e-mail/i.test(header)) {
      requiredOption.selected = true;
    }

    if (isCountryHeader(header)) countryOption.selected = true;
  });

  postal.disabled = false;
  required.disabled = false;
  $('country').disabled = false;
  countryColumn.disabled = false;
}

function isPostalHeader(header) {
  const normalized = String(header)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  return /^(?:cp|c p|code postal|code postale|codepostal|postal|postal code|postcode|post code|zip|zip code)(?:\s|$)/.test(normalized)
    || /(?:^|\s)(?:cp|code postal|code postale|codepostal|postal code|postcode|post code|zip code)(?:\s|$)/.test(normalized);
}

function isCountryHeader(header) {
  const normalized = normalizeCountryToken(header);
  return /(?:^| )(?:PAYS|COUNTRY|COUNTRY CODE|CODE PAYS|NATIONALITE)(?: |$)/.test(normalized);
}

function normalizeCountryToken(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .trim();
}

function resolveCountry(value) {
  const token = normalizeCountryToken(value);

  if (countryAliasLookup[token]) {
    return countryAliasLookup[token];
  }

  // Accepte aussi « FR - France » ou « France (FR) ».
  const parts = token.split(' ').filter(Boolean);

  for (const part of parts) {
    if (countryAliasLookup[part]) return countryAliasLookup[part];
  }

  return null;
}

function runChecks() {
  const issues = [];

  if ($('checkStructure').checked) {
    state.parseIssues.forEach(item => {
      const column = item.col === '—'
        ? '—'
        : state.headers[item.col - 1] || `Colonne ${item.col}`;

      issues.push({
        line: item.line,
        column,
        type: 'Structure du fichier',
        value: '',
        detail: item.detail
      });
    });
  }

  if ($('checkRequired').checked) {
    const selectedColumns = [...$('requiredColumns').selectedOptions]
      .map(option => Number(option.value));

    state.rows.forEach((row, rowIndex) => {
      selectedColumns.forEach(columnIndex => {
        if (!String(row[columnIndex] ?? '').trim()) {
          issues.push({
            line: state.dataLineNumbers[rowIndex],
            column: state.headers[columnIndex],
            type: 'Champ obligatoire',
            value: '(vide)',
            detail: 'Cette valeur est vide.'
          });
        }
      });
    });
  }

  if ($('checkPostal').checked) {
    const postalColumns = [...$('postalColumns').selectedOptions]
      .map(option => Number(option.value));

    if (!postalColumns.length) {
      return showStatus('Sélectionnez au moins une colonne de code postal.', true);
    }

    state.rows.forEach((row, rowIndex) => {
      const populatedColumns = postalColumns.filter(columnIndex =>
        String(row[columnIndex] ?? '').trim()
      );

      if (!populatedColumns.length) return;

      const countryColumnValue = $('countryColumn').value;
      const countryCode = countryColumnValue === 'fixed'
        ? $('country').value
        : resolveCountry(row[Number(countryColumnValue)]);

      if (!countryCode || !countryPatterns[countryCode]) {
        const countryValue = countryColumnValue === 'fixed'
          ? $('country').selectedOptions[0].textContent
          : String(row[Number(countryColumnValue)] ?? '').trim();

        issues.push({
          line: state.dataLineNumbers[rowIndex],
          column: countryColumnValue === 'fixed'
            ? 'Pays de référence'
            : state.headers[Number(countryColumnValue)],
          type: 'Pays non reconnu',
          value: countryValue || '(vide)',
          detail: 'Pays vide ou non reconnu. Utilisez un code ou un nom de pays pris en charge, par exemple FR, FRA ou France.'
        });

        return;
      }

      const pattern = countryPatterns[countryCode];

      populatedColumns.forEach(columnIndex => {
        const raw = String(row[columnIndex] ?? '').trim();
        const normalized = raw.replace(/\u00a0/g, ' ').trim();

        if (!pattern.regex.test(normalized)) {
          issues.push({
            line: state.dataLineNumbers[rowIndex],
            column: state.headers[columnIndex],
            type: 'Code postal',
            value: raw,
            detail: `Format attendu pour ${countryNames[countryCode]} : ${pattern.label}.`
          });
        }
      });
    });
  }

  if ($('checkChars').checked) {
    state.rows.forEach((row, rowIndex) => {
      row.forEach((value, columnIndex) => {
        const text = String(value ?? '');
        const matches = [...text.matchAll(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\uFFFD\u200B\u200C\u200D\uFEFF]/g)];

        if (matches.length) {
          issues.push({
            line: state.dataLineNumbers[rowIndex],
            column: state.headers[columnIndex],
            type: 'Caractère suspect',
            value: visibleValue(text),
            detail: `${matches.length} caractère(s) de contrôle, invisible(s) ou de remplacement détecté(s).`
          });
        }
      });
    });
  }

  state.issues = issues.sort((a, b) => Number(a.line) - Number(b.line));
  renderResults();
}

function renderResults() {
  $('resultsPanel').classList.remove('hidden');

  const errorCount = state.issues.length;
  const errorLines = new Set(state.issues.map(issue => issue.line)).size;

  $('resultSummary').textContent =
    `${state.rows.length} ligne(s) analysée(s) · ${errorCount} anomalie(s) détectée(s)`;

  $('summaryCards').innerHTML = `
    <div class="summary-card">
      <span>Lignes analysées</span>
      <strong>${state.rows.length}</strong>
    </div>
    <div class="summary-card error">
      <span>Anomalies détectées</span>
      <strong>${errorCount}</strong>
    </div>
    <div class="summary-card">
      <span>Lignes concernées</span>
      <strong>${errorLines}</strong>
    </div>
  `;

  $('noErrors').classList.toggle('hidden', errorCount !== 0);
  $('issuesWrap').classList.toggle('hidden', errorCount === 0);
  $('issuesBody').innerHTML = '';

  state.issues.forEach(issue => {
    const row = document.createElement('tr');

    [issue.line, issue.column, issue.type, issue.value, issue.detail].forEach((value, index) => {
      const cell = document.createElement('td');

      if (index === 3) {
        const code = document.createElement('code');
        code.textContent = String(value);
        cell.append(code);
      } else {
        cell.textContent = String(value);
      }

      row.append(cell);
    });

    $('issuesBody').append(row);
  });

  $('exportButton').disabled = errorCount === 0;
  $('resultsPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function exportReport() {
  const rows = [
    ['Ligne', 'Colonne', 'Contrôle', 'Valeur détectée', 'Détail'],
    ...state.issues.map(issue => [
      issue.line,
      issue.column,
      issue.type,
      issue.value,
      issue.detail
    ])
  ];

  const csv = '\uFEFF' + rows
    .map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(';'))
    .join('\r\n');

  download(
    new Blob([csv], { type: 'text/csv;charset=utf-8' }),
    `rapport-controle-${state.file?.name.replace(/\.[^.]+$/, '') || 'fichier'}.csv`
  );
}

function resetApp() {
  state.file = null;
  state.kind = null;
  state.workbook = null;
  state.headers = [];
  state.rows = [];
  state.parseIssues = [];
  state.issues = [];

  $('fileInput').value = '';
  $('fileInfo').classList.add('hidden');
  $('sheetRow').classList.add('hidden');
  $('resultsPanel').classList.add('hidden');
  $('runButton').disabled = true;
  $('resetButton').disabled = true;
  $('delimiter').disabled = true;
  $('postalColumns').disabled = true;
  $('requiredColumns').disabled = true;
  $('country').disabled = true;
  $('countryColumn').disabled = true;
  $('postalColumns').innerHTML = '<option>Chargez un fichier d’abord</option>';
  $('requiredColumns').innerHTML = '';
  $('countryColumn').innerHTML =
    '<option value="fixed">Utiliser le pays de référence ci-dessus</option>';

  showStatus('');
}

function showStatus(message, error = false) {
  $('statusMessage').textContent = message;
  $('statusMessage').style.color = error ? '#b42318' : '';
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / 1048576).toFixed(1)} Mo`;
}

function visibleValue(text) {
  return text.replace(
    /[\u0000-\u001F\u007F\uFFFD\u200B\u200C\u200D\uFEFF]/g,
    character => ({
      '\u0000': '[NUL]',
      '\u0009': '[TAB]',
      '\u000A': '[LF]',
      '\u000D': '[CR]',
      '\uFFFD': '[caractère de remplacement]'
    }[character] || '[caractère invisible]')
  );
}

function download(blob, name) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}