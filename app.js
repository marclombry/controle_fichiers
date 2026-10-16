'use strict';

const $ = (id) => document.getElementById(id);

const COUNTRY_NAMES = {
  FR: 'France', BE: 'Belgique', DE: 'Allemagne', ES: 'Espagne', IT: 'Italie',
  NL: 'Pays-Bas', PT: 'Portugal', CH: 'Suisse', LU: 'Luxembourg', US: 'États-Unis',
  CA: 'Canada', GB: 'Royaume-Uni', IE: 'Irlande', AU: 'Australie', AT: 'Autriche',
  DK: 'Danemark', NO: 'Norvège', SE: 'Suède', FI: 'Finlande', PL: 'Pologne',
  CZ: 'Tchéquie', GR: 'Grèce', RO: 'Roumanie', HU: 'Hongrie', JP: 'Japon',
  CN: 'Chine', IN: 'Inde', BR: 'Brésil', NZ: 'Nouvelle-Zélande', ZA: 'Afrique du Sud',
  SG: 'Singapour', KR: 'Corée du Sud', TR: 'Turquie', RU: 'Russie', UA: 'Ukraine',
  IL: 'Israël', MX: 'Mexique', AR: 'Argentine', IS: 'Islande', SI: 'Slovénie',
  HR: 'Croatie', SK: 'Slovaquie', BG: 'Bulgarie', EE: 'Estonie', LV: 'Lettonie',
  LT: 'Lituanie', CY: 'Chypre', MT: 'Malte', KZ: 'Kazakhstan', ID: 'Indonésie',
  PH: 'Philippines', TH: 'Thaïlande', VN: 'Vietnam', PK: 'Pakistan', SA: 'Arabie saoudite'
};

const COUNTRY_ALIASES = {
  FR: ['FRANCE', 'FR', 'FRA', 'FRENCH REPUBLIC', 'FRANCE METROPOLITAINE'],
  BE: ['BELGIQUE', 'BELGIUM', 'BE', 'BEL'],
  DE: ['ALLEMAGNE', 'GERMANY', 'DE', 'DEU'],
  ES: ['ESPAGNE', 'SPAIN', 'ES', 'ESP'],
  IT: ['ITALIE', 'ITALY', 'IT', 'ITA'],
  NL: ['PAYS BAS', 'NETHERLANDS', 'THE NETHERLANDS', 'NL', 'NLD'],
  PT: ['PORTUGAL', 'PT', 'PRT'],
  CH: ['SUISSE', 'SWITZERLAND', 'CH', 'CHE'],
  LU: ['LUXEMBOURG', 'LU', 'LUX'],
  GB: ['ROYAUME UNI', 'UNITED KINGDOM', 'GREAT BRITAIN', 'GB', 'GBR', 'UK'],
  US: ['ETATS UNIS', 'UNITED STATES', 'UNITED STATES OF AMERICA', 'US', 'USA'],
  CA: ['CANADA', 'CA', 'CAN'],
  IE: ['IRLANDE', 'IRELAND', 'IE', 'IRL'],
  AU: ['AUSTRALIE', 'AUSTRALIA', 'AU', 'AUS'],
  AT: ['AUTRICHE', 'AUSTRIA', 'AT', 'AUT'],
  DK: ['DANEMARK', 'DENMARK', 'DK', 'DNK'],
  NO: ['NORVEGE', 'NORWAY', 'NO', 'NOR'],
  SE: ['SUEDE', 'SWEDEN', 'SE', 'SWE'],
  FI: ['FINLANDE', 'FINLAND', 'FI', 'FIN'],
  PL: ['POLOGNE', 'POLAND', 'PL', 'POL'],
  CZ: ['TCHEQUIE', 'CZECHIA', 'CZECH REPUBLIC', 'CZ', 'CZE'],
  GR: ['GRECE', 'GREECE', 'GR', 'GRC'],
  RO: ['ROUMANIE', 'ROMANIA', 'RO', 'ROU'],
  HU: ['HONGRIE', 'HUNGARY', 'HU', 'HUN'],
  JP: ['JAPON', 'JAPAN', 'JP', 'JPN'],
  CN: ['CHINE', 'CHINA', 'CN', 'CHN'],
  IN: ['INDE', 'INDIA', 'IN', 'IND'],
  BR: ['BRESIL', 'BRAZIL', 'BR', 'BRA'],
  NZ: ['NOUVELLE ZELANDE', 'NEW ZEALAND', 'NZ', 'NZL'],
  ZA: ['AFRIQUE DU SUD', 'SOUTH AFRICA', 'ZA', 'ZAF'],
  SG: ['SINGAPOUR', 'SINGAPORE', 'SG', 'SGP'],
  KR: ['COREE DU SUD', 'SOUTH KOREA', 'REPUBLIC OF KOREA', 'KR', 'KOR'],
  TR: ['TURQUIE', 'TURKEY', 'TR', 'TUR'],
  RU: ['RUSSIE', 'RUSSIA', 'RU', 'RUS'],
  UA: ['UKRAINE', 'UA', 'UKR'],
  IL: ['ISRAEL', 'IL', 'ISR'],
  MX: ['MEXIQUE', 'MEXICO', 'MX', 'MEX'],
  AR: ['ARGENTINE', 'ARGENTINA', 'AR', 'ARG'],
  IS: ['ISLANDE', 'ICELAND', 'IS', 'ISL'],
  SI: ['SLOVENIE', 'SLOVENIA', 'SI', 'SVN'],
  HR: ['CROATIE', 'CROATIA', 'HR', 'HRV'],
  SK: ['SLOVAQUIE', 'SLOVAKIA', 'SK', 'SVK'],
  BG: ['BULGARIE', 'BULGARIA', 'BG', 'BGR'],
  EE: ['ESTONIE', 'ESTONIA', 'EE', 'EST'],
  LV: ['LETTONIE', 'LATVIA', 'LV', 'LVA'],
  LT: ['LITUANIE', 'LITHUANIA', 'LT', 'LTU'],
  CY: ['CHYPRE', 'CYPRUS', 'CY', 'CYP'],
  MT: ['MALTE', 'MALTA', 'MT', 'MLT'],
  KZ: ['KAZAKHSTAN', 'KZ', 'KAZ'],
  ID: ['INDONESIE', 'INDONESIA', 'ID', 'IDN'],
  PH: ['PHILIPPINES', 'PH', 'PHL'],
  TH: ['THAILANDE', 'THAILAND', 'TH', 'THA'],
  VN: ['VIETNAM', 'VN', 'VNM'],
  PK: ['PAKISTAN', 'PK', 'PAK'],
  SA: ['ARABIE SAOUDITE', 'SAUDI ARABIA', 'SA', 'SAU']
};

const POSTAL_RULES = {
  FR: /^\d{5}$/,
  BE: /^\d{4}$/,
  DE: /^\d{5}$/,
  ES: /^\d{5}$/,
  IT: /^\d{5}$/,
  NL: /^\d{4}\s?[A-Z]{2}$/i,
  PT: /^\d{4}-\d{3}$/,
  CH: /^\d{4}$/,
  LU: /^\d{4}$/,
  US: /^\d{5}(?:-\d{4})?$/,
  CA: /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
  GB: /^(?:GIR\s?0AA|[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})$/i,
  IE: /^(?:[A-Z]\d{2}\s?[A-Z0-9]{4}|D6W\s?[A-Z0-9]{4})$/i,
  AU: /^\d{4}$/,
  AT: /^\d{4}$/,
  DK: /^\d{4}$/,
  NO: /^\d{4}$/,
  SE: /^\d{3}\s?\d{2}$/,
  FI: /^\d{5}$/,
  PL: /^\d{2}-\d{3}$/,
  CZ: /^\d{3}\s?\d{2}$/,
  GR: /^\d{3}\s?\d{2}$/,
  RO: /^\d{6}$/,
  HU: /^\d{4}$/,
  JP: /^\d{3}-?\d{4}$/,
  CN: /^\d{6}$/,
  IN: /^\d{6}$/,
  BR: /^\d{5}-?\d{3}$/,
  NZ: /^\d{4}$/,
  ZA: /^\d{4}$/,
  SG: /^\d{6}$/,
  KR: /^\d{5}$/,
  TR: /^\d{5}$/,
  RU: /^\d{6}$/,
  UA: /^\d{5}$/,
  IL: /^\d{7}$/,
  MX: /^\d{5}$/,
  AR: /^(?:\d{4}|[A-Z]\d{4}[A-Z]{3})$/i,
  IS: /^\d{3}$/,
  SI: /^\d{4}$/,
  HR: /^\d{5}$/,
  SK: /^\d{3}\s?\d{2}$/,
  BG: /^\d{4}$/,
  EE: /^\d{5}$/,
  LV: /^(?:LV-)?\d{4}$/i,
  LT: /^(?:LT-)?\d{5}$/i,
  CY: /^\d{4}$/,
  MT: /^[A-Z]{3}\s?\d{4}$/i,
  KZ: /^\d{6}$/,
  ID: /^\d{5}$/,
  PH: /^\d{4}$/,
  TH: /^\d{5}$/,
  VN: /^\d{5,6}$/,
  PK: /^\d{5}$/,
  SA: /^\d{5}$/
};

const POSTAL_HINT = {
  FR: '5 chiffres', BE: '4 chiffres', DE: '5 chiffres', ES: '5 chiffres', IT: '5 chiffres',
  NL: '4 chiffres et 2 lettres (1234 AB)', PT: 'format 0000-000', CH: '4 chiffres', LU: '4 chiffres',
  US: '5 chiffres ou format ZIP+4', CA: 'format canadien (A1A 1A1)', GB: 'format britannique (SW1A 1AA)',
  IE: 'format Eircode', AU: '4 chiffres', AT: '4 chiffres', DK: '4 chiffres', NO: '4 chiffres',
  SE: 'format 123 45', FI: '5 chiffres', PL: 'format 00-000', CZ: 'format 123 45', GR: 'format 123 45',
  RO: '6 chiffres', HU: '4 chiffres', JP: 'format 123-4567 ou 1234567', CN: '6 chiffres',
  IN: '6 chiffres', BR: 'format 12345-678', NZ: '4 chiffres', ZA: '4 chiffres', SG: '6 chiffres',
  KR: '5 chiffres', TR: '5 chiffres', RU: '6 chiffres', UA: '5 chiffres', IL: '7 chiffres',
  MX: '5 chiffres', AR: 'format argentin', IS: '3 chiffres', SI: '4 chiffres', HR: '5 chiffres',
  SK: 'format 123 45', BG: '4 chiffres', EE: '5 chiffres', LV: '4 chiffres', LT: '5 chiffres',
  CY: '4 chiffres', MT: '3 lettres et 4 chiffres', KZ: '6 chiffres', ID: '5 chiffres',
  PH: '4 chiffres', TH: '5 chiffres', VN: '5 ou 6 chiffres', PK: '5 chiffres', SA: '5 chiffres'
};

const POSTAL_HEADER = /(^|\b)(cp|code\s*postal(?:e)?|codepostal|code\s*post|postal\s*code|postcode|post\s*code|zip(?:\s*code)?)(\b|$)/i;
const COUNTRY_HEADER = /(^|\b)(pays|country|country\s*code|code\s*pays|nation|nationalite)(\b|$)/i;

let fileData = null;
let activeSheet = 0;
let headerIndex = 0;
let detectedPostal = [];
let errors = [];
let checked = false;
let errorPage = 0;
const PAGE_SIZE = 50;

function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[ch]);
}

function decodeText(buffer) {
  const bytes = new Uint8Array(buffer);

  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return new TextDecoder('utf-8').decode(buffer);
  }

  const utf8 = new TextDecoder('utf-8').decode(buffer);

  if (utf8.includes('\uFFFD')) {
    try {
      return new TextDecoder('windows-1252').decode(buffer);
    } catch (_) {
      return utf8;
    }
  }

  return utf8;
}

function parseDelimited(text, delimiter) {
  const rows = [];
  const issues = [];
  let cells = [];
  let value = '';
  let quoted = false;
  let afterQuote = false;
  let afterQuoteReported = false;
  let line = 1;
  let recordLine = 1;

  const pushCell = () => {
    cells.push(value);
    value = '';
    afterQuote = false;
    afterQuoteReported = false;
  };

  const pushRecord = () => {
    pushCell();
    if (cells.some(cell => String(cell ?? '').trim() !== '')) {
      rows.push({ cells, line: recordLine });
    }
    cells = [];
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        value += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
        afterQuote = true;
      } else {
        value += ch;
        if (ch === '\n') line++;
      }
      continue;
    }

    if (ch === '"') {
      if (value.length === 0 && !afterQuote) {
        quoted = true;
      } else {
        issues.push({
          line,
          col: cells.length + 1,
          rowLine: recordLine,
          position: i + 1,
          character: '"',
          detail: `Guillemet inattendu à la ligne ${line}, cellule ${cells.length + 1}, position ${i + 1} du fichier.`
        });
        value += ch;
      }
    } else if (ch === delimiter) {
      pushCell();
    } else if (ch === '\r' || ch === '\n') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      pushRecord();
      line++;
      recordLine = line;
    } else {
      if (afterQuote && !/[ \t]/.test(ch) && !afterQuoteReported) {
        issues.push({
          line,
          col: cells.length + 1,
          rowLine: recordLine,
          position: i + 1,
          character: ch,
          detail: `Caractère « ${ch} » inattendu après le guillemet fermant, ligne ${line}, cellule ${cells.length + 1}, position ${i + 1} du fichier.`
        });
        afterQuoteReported = true;
      }
      value += ch;
    }
  }

  if (quoted) {
    issues.push({
      line,
      col: cells.length + 1,
      rowLine: recordLine,
      position: text.length,
      character: '"',
      detail: `Guillemet ouvert mais non refermé avant la fin du fichier (ligne ${line}, cellule ${cells.length + 1}, position ${text.length} du fichier).`
    });
  }

  if (value.length || cells.length) pushRecord();
  return { rows, issues };
}

function detectDelimiter(text) {
  const sample = text.split(/\r?\n/).slice(0, 20).filter(line => line.trim()).join('\n');
  let selected = ';';
  let best = -1;

  for (const delimiter of [';', ',', '\t', '|']) {
    const rows = parseDelimited(sample, delimiter).rows;
    const widths = rows.map(row => row.cells.length);
    if (!widths.length) continue;

    const width = widths[0];
    const consistency = widths.filter(item => item === width).length / widths.length;
    const score = width > 1 ? width * consistency : 0;

    if (score > best) {
      best = score;
      selected = delimiter;
    }
  }

  return selected;
}

function detectHeader(rows) {
  let selected = 0;
  let best = -Infinity;

  for (let i = 0; i < Math.min(10, rows.length); i++) {
    const filled = (rows[i] || [])
      .map(value => String(value ?? '').trim())
      .filter(Boolean);

    const named = filled.filter(value => /[a-zA-ZÀ-ÿ]/.test(value)).length;
    const duplicates = filled.length - new Set(filled.map(normalize)).size;
    const knownHeader = filled.some(value =>
      POSTAL_HEADER.test(normalize(value)) || COUNTRY_HEADER.test(normalize(value))
    );

    const score = named * 3 + filled.length - duplicates * 2 + (knownHeader ? 12 : 0);

    if (filled.length && score > best) {
      best = score;
      selected = i;
    }
  }

  return selected;
}

async function readFile(file) {
  const extension = file.name.split('.').pop().toLowerCase();

  if (['csv', 'txt', 'tsv'].includes(extension)) {
    const text = decodeText(await file.arrayBuffer()).replace(/^\uFEFF/, '');
    const delimiter = extension === 'tsv' ? '\t' : detectDelimiter(text);
    const parsed = parseDelimited(text, delimiter);

    return {
      name: file.name,
      sheets: [{
        name: 'Données',
        rows: parsed.rows.map(row => row.cells),
        lines: parsed.rows.map(row => row.line),
        parseIssues: parsed.issues
      }]
    };
  }

  if (['xlsx', 'xlsm'].includes(extension)) {
    if (!window.XLSX) {
      throw new Error('Le lecteur Excel ne s’est pas chargé. Rechargez la page avec une connexion Internet.');
    }

    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array', raw: true });

    const sheets = workbook.SheetNames.map(name => {
      const rows = XLSX.utils.sheet_to_json(workbook.Sheets[name], {
        header: 1,
        raw: true,
        defval: '',
        blankrows: false
      });

      return {
        name,
        rows,
        lines: rows.map((_, index) => index + 1),
        parseIssues: []
      };
    }).filter(sheet => sheet.rows.length);

    return { name: file.name, sheets };
  }

  throw new Error('Format non pris en charge. Choisissez CSV, TXT, TSV ou XLSX.');
}

function currentSheet() {
  return fileData?.sheets[activeSheet];
}

function currentHeaders() {
  return (currentSheet()?.rows[headerIndex] || [])
    .map((value, index) => String(value ?? '').trim() || `Colonne ${index + 1}`);
}

function currentDataRows() {
  return currentSheet()?.rows.slice(headerIndex + 1) || [];
}

function currentLines() {
  return currentSheet()?.lines.slice(headerIndex + 1) || [];
}

function onFileLoaded() {
  const sheet = currentSheet();
  headerIndex = detectHeader(sheet.rows);

  $('fileInfo').classList.remove('error');
  $('fileInfo').textContent = `${fileData.name} · ${fileData.sheets.length} feuille(s)`;

  $('sheetPickerWrap').classList.toggle('hidden', fileData.sheets.length < 2);
  $('sheetPicker').innerHTML = fileData.sheets
    .map((sheet, index) => `<option value="${index}" ${index === activeSheet ? 'selected' : ''}>${escapeHTML(sheet.name)}</option>`)
    .join('');

  $('headerRowWrap').classList.remove('hidden');
  renderHeaderOptions(true);
  $('settingsPanel').classList.remove('hidden');
  $('resultsPanel').classList.add('hidden');
  $('rowCount').textContent = `${currentDataRows().length} ligne(s)`;
}

function renderHeaderOptions(firstLoad = false) {
  const sheet = currentSheet();
  const count = Math.min(10, sheet.rows.length);

  $('headerRow').innerHTML = Array.from({ length: count }, (_, index) => {
    const preview = (sheet.rows[index] || [])
      .slice(0, 5)
      .map(value => String(value ?? '').trim())
      .filter(Boolean)
      .join(' · ') || '(ligne vide)';

    return `<option value="${index}" ${index === headerIndex ? 'selected' : ''}>Ligne ${index + 1} — ${escapeHTML(preview)}</option>`;
  }).join('');

  renderColumnOptions(firstLoad);
  updatePreview();
}

function renderColumnOptions(firstLoad = false) {
  const headers = currentHeaders();
  const detectedCountry = headers.findIndex(header => COUNTRY_HEADER.test(normalize(header)));

  detectedPostal = headers
    .map((header, index) => POSTAL_HEADER.test(normalize(header)) ? index : -1)
    .filter(index => index >= 0);

  $('countryColumn').innerHTML =
    `<option value="-1">Aucun — utiliser le pays par défaut</option>` +
    headers.map((header, index) => `<option value="${index}">${escapeHTML(header)}</option>`).join('');

  $('countryColumn').value = String(detectedCountry);

  const countrySelect = $('defaultCountry');
  const previousDefault = countrySelect.value || 'AUTO';

  countrySelect.innerHTML =
    `<option value="AUTO">À déterminer (recommandé)</option>` +
    `<option value="FR">France</option>` +
    Object.entries(COUNTRY_NAMES)
      .filter(([code]) => code !== 'FR')
      .map(([code, name]) => `<option value="${code}">${escapeHTML(name)}</option>`)
      .join('');

  countrySelect.value = firstLoad ? 'AUTO' : previousDefault;

  const selectedColumns = new Set(detectedPostal);

  $('postalColumns').innerHTML = headers.length
    ? headers.map((header, index) =>
        `<label class="column-chip"><input type="checkbox" value="${index}" ${selectedColumns.has(index) ? 'checked' : ''}><span>${escapeHTML(header)}</span></label>`
      ).join('')
    : '<div class="empty-columns">Aucune colonne trouvée. Vérifiez la ligne des en-têtes.</div>';
}

function updatePreview() {
  const headers = currentHeaders();
  const rows = currentDataRows().slice(0, 8);

  if (!headers.length) {
    $('dataPreview').innerHTML = '<p class="muted">Aucune donnée à afficher.</p>';
    return;
  }

  $('dataPreview').innerHTML = `
    <table>
      <thead><tr><th>Ligne</th>${headers.map(header => `<th>${escapeHTML(header)}</th>`).join('')}</tr></thead>
      <tbody>
        ${rows.map((row, index) => `
          <tr>
            <td>${currentLines()[index] ?? index + headerIndex + 2}</td>
            ${headers.map((_, column) => `<td>${escapeHTML(row[column] ?? '')}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>`;
}

function countryCode(value) {
  const candidate = normalize(value);
  if (!candidate) return '';

  for (const [code, aliases] of Object.entries(COUNTRY_ALIASES)) {
    if (aliases.some(alias => candidate === alias || candidate.startsWith(alias + ' '))) {
      return code;
    }
  }

  return '';
}

function selectedPostalColumns() {
  return [...$('postalColumns').querySelectorAll('input:checked')]
    .map(input => Number(input.value));
}

function postalRuleMessage(code) {
  const countryName = COUNTRY_NAMES[code] || code;
  return POSTAL_HINT[code]
    ? `Format attendu pour ${countryName} : ${POSTAL_HINT[code]}.`
    : `Aucune règle de format n’est configurée pour ${countryName}.`;
}

function pushError(source, line, column, type, value, detail, columnIndex = null, rowLine = line, character = '') {
  errors.push({
    source,
    line,
    rowLine,
    column,
    type,
    value: String(value ?? ''),
    detail,
    columnIndex,
    character
  });
}

function normalizePostal(value, code) {
  let postal = String(value ?? '')
    .replace(/\u00a0/g, ' ')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ');

  if (/^\d+[.,]0+$/.test(postal)) {
    postal = postal.replace(/[.,]0+$/, '');
  }

  const numericCountries = [
    'FR', 'BE', 'DE', 'ES', 'IT', 'CH', 'LU', 'FI', 'AU', 'AT', 'DK',
    'NO', 'RO', 'HU', 'CN', 'IN', 'NZ', 'ZA', 'SG', 'KR', 'TR', 'RU',
    'UA', 'IL', 'MX', 'IS', 'SI', 'HR', 'BG', 'EE', 'CY', 'KZ', 'ID',
    'PH', 'TH', 'VN', 'PK', 'SA'
  ];

  if (numericCountries.includes(code)) {
    postal = postal.replace(/\s+/g, '');
  }

  return postal;
}

function validate() {
  const sheet = currentSheet();
  if (!fileData || !sheet) return;

  errors = [];

  const headers = currentHeaders();
  const rows = currentDataRows();
  const lines = currentLines();
  const postalColumns = selectedPostalColumns();
  const countryColumn = Number($('countryColumn').value);
  const fallback = $('defaultCountry').value;
  const expectedColumns = (sheet.rows[headerIndex] || []).length;

  if (postalColumns.length === 0) {
    pushError(fileData.name, headerIndex + 1, '—', 'Configuration', '',
      'Sélectionnez au moins une colonne de code postal.');
  }

  if ($('checkStructure').checked) {
    sheet.parseIssues.forEach(issue => {
      const quoteIssue = /guillemet/i.test(issue.detail);

      pushError(
        fileData.name,
        issue.line,
        headers[issue.col - 1] || `Colonne ${issue.col}`,
        quoteIssue ? 'Guillemet mal placé' : 'Structure CSV/TXT',
        issue.character || '',
        issue.detail,
        issue.col - 1,
        issue.rowLine ?? issue.line,
        issue.character || ''
      );
    });

    rows.forEach((row, index) => {
      const hasData = row.some(value => String(value ?? '').trim() !== '');

      if (hasData && row.length !== expectedColumns) {
        pushError(
          fileData.name,
          lines[index] ?? index + headerIndex + 2,
          '—',
          'Nombre de colonnes',
          '',
          `${row.length} colonne(s), contre ${expectedColumns} dans l’en-tête.`
        );
      }
    });
  }

  rows.forEach((row, index) => {
    if (!row.some(value => String(value ?? '').trim() !== '')) return;

    const line = lines[index] ?? index + headerIndex + 2;
    let code = '';
    let hasCountryValue = false;
    let countryUnknown = false;

    if (countryColumn >= 0) {
      const countryValue = String(row[countryColumn] ?? '').trim();

      if (countryValue) {
        hasCountryValue = true;
        code = countryCode(countryValue);

        if (!code && postalColumns.some(column => String(row[column] ?? '').trim())) {
          countryUnknown = true;

          pushError(
            fileData.name,
            line,
            headers[countryColumn],
            'Pays non reconnu',
            countryValue,
            'Le pays n’est pas reconnu. Vérifiez cette cellule avant de contrôler le code postal.',
            countryColumn
          );
        }
      }
    }

    if (!code && !hasCountryValue) {
      code = fallback === 'AUTO' ? '' : fallback;
    }

    postalColumns.forEach(column => {
      const original = String(row[column] ?? '').trim();
      if (!original || countryUnknown) return;

      if (!code) {
        pushError(
          fileData.name,
          line,
          headers[column],
          'Pays indéterminé',
          original,
          'Le code postal n’est pas déclaré invalide : le pays manque. Choisissez un pays par défaut ou complétez la colonne pays.',
          column
        );
        return;
      }

      const rule = POSTAL_RULES[code];

      if (!rule) {
        pushError(
          fileData.name,
          line,
          headers[column],
          'Règle indisponible',
          original,
          postalRuleMessage(code),
          column
        );
        return;
      }

      let postal = normalizePostal(original, code);

      if (code === 'FR' && $('padFrench').checked && /^\d{1,4}$/.test(postal)) {
        postal = postal.padStart(5, '0');
      }

      if (!rule.test(postal)) {
        pushError(
          fileData.name,
          line,
          headers[column],
          'Code postal invalide',
          original,
          postalRuleMessage(code),
          column
        );
      }
    });

    if ($('checkSpecial').checked) {
      row.forEach((value, column) => {
        const text = String(value ?? '');
        const matches = [...text.matchAll(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\uFFFD\u200B\u200C\u200D\uFEFF]/g)];

        if (!matches.length) return;

        const positions = matches.map(match => {
          const code = match[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
          return `${match.index + 1} (U+${code})`;
        });

        pushError(
          fileData.name,
          line,
          headers[column] || `Colonne ${column + 1}`,
          'Caractère suspect',
          showSpecial(text),
          `Caractère(s) suspect(s) dans cette cellule, position(s) ${positions.join(', ')}.`,
          column
        );
      });
    }
  });

  errors.sort((a, b) =>
    Number(a.line) - Number(b.line) || a.column.localeCompare(b.column)
  );

  checked = true;
  showResults();
}

function showSpecial(text) {
  const labels = {
    '\u0000': '[NUL]',
    '\u0009': '[TAB]',
    '\u000A': '[SAUT DE LIGNE]',
    '\u000D': '[RETOUR CHARIOT]',
    '\u007F': '[SUPPR]',
    '\uFFFD': '[CARACTÈRE MAL DÉCODÉ]',
    '\u200B': '[ESPACE INVISIBLE]',
    '\u200C': '[CARACTÈRE INVISIBLE]',
    '\u200D': '[CARACTÈRE INVISIBLE]',
    '\uFEFF': '[BOM INVISIBLE]'
  };

  const visible = String(text).replace(
    /[\u0000-\u001F\u007F\uFFFD\u200B\u200C\u200D\uFEFF]/g,
    character => labels[character] || '[CARACTÈRE DE CONTRÔLE]'
  );

  return escapeHTML(visible);
}

function errorKindMatches(error, kind) {
  if (kind === 'all') return true;

  if (kind === 'postal') {
    return ['Code postal invalide', 'Règle indisponible'].includes(error.type);
  }

  if (kind === 'country') {
    return ['Pays indéterminé', 'Pays non reconnu'].includes(error.type);
  }

  if (kind === 'characters') {
    return error.type === 'Caractère suspect' || error.type === 'Guillemet mal placé';
  }

  if (kind === 'structure') {
    return error.type.includes('Structure') || error.type === 'Nombre de colonnes';
  }

  return true;
}

function renderErrorPage() {
  const headers = currentHeaders();
  const rows = currentDataRows();
  const lines = currentLines();
  const rowByLine = new Map(
    lines.map((line, index) => [String(line), rows[index]])
  );

  const countryColumn = Number($('countryColumn').value);
  const focusColumns = new Set([
    ...selectedPostalColumns(),
    countryColumn
  ].filter(index => index >= 0));

  const groups = new Map();

  errors.forEach(error => {
    const rowKey = String(error.rowLine ?? error.line);

    if (!groups.has(rowKey)) {
      groups.set(rowKey, []);
    }

    groups.get(rowKey).push(error);
  });

  const filter = $('errorFilter').value;
  const query = $('errorSearch').value.trim().toLocaleLowerCase('fr-FR');

  const matchingGroups = [...groups.entries()].filter(([line, lineErrors]) => {
    if (!lineErrors.some(error => errorKindMatches(error, filter))) {
      return false;
    }

    if (!query) return true;

    const row = rowByLine.get(line) || [];
    const searchable = [
      line,
      ...row,
      ...lineErrors.flatMap(error => [
        error.type,
        error.column,
        error.value,
        error.detail
      ])
    ].join(' ').toLocaleLowerCase('fr-FR');

    return searchable.includes(query);
  });

  const pageCount = Math.max(1, Math.ceil(matchingGroups.length / PAGE_SIZE));
  errorPage = Math.min(errorPage, pageCount - 1);

  const visibleGroups = matchingGroups.slice(
    errorPage * PAGE_SIZE,
    (errorPage + 1) * PAGE_SIZE
  );

  $('shownCount').textContent =
    `${matchingGroups.length} ligne(s) correspondante(s)`;

  $('pagination').classList.toggle('hidden', matchingGroups.length <= PAGE_SIZE);
  $('pageInfo').textContent = `Page ${errorPage + 1} / ${pageCount}`;
  $('previousPage').disabled = errorPage === 0;
  $('nextPage').disabled = errorPage >= pageCount - 1;

  if (!matchingGroups.length) {
    $('errorTableWrap').innerHTML =
      '<div class="empty-results">Aucune anomalie ne correspond à ce filtre.</div>';
    return;
  }

  $('errorTableWrap').innerHTML = visibleGroups.map(([line, lineErrors]) => {
    const sourceRow = rowByLine.get(line);

    const problemColumns = new Set(
      lineErrors
        .map(error => error.columnIndex)
        .filter(index => Number.isInteger(index) && index >= 0)
    );

    const width = Math.max(headers.length, sourceRow?.length || 0);

    if (lineErrors.some(error => error.type === 'Nombre de colonnes')) {
      for (let index = 0; index < width; index++) {
        problemColumns.add(index);
      }
    }

    const compactColumns = [...new Set([
      ...focusColumns,
      ...problemColumns
    ])]
      .filter(index => index < width)
      .sort((a, b) => a - b);

    const fieldMarkup = (index) => {
      const name = headers[index] || `Colonne ${index + 1}`;
      const classes = [
        problemColumns.has(index) ? 'problem' : '',
        focusColumns.has(index) ? 'focus' : ''
      ].filter(Boolean).join(' ');

      return `<div class="row-field ${classes}">
        <span class="row-field-name">${escapeHTML(name)}</span>
        <span class="row-field-value">${showSpecial(String(sourceRow[index] ?? '(vide)'))}</span>
      </div>`;
    };

    const fieldList = sourceRow
      ? `${compactColumns.length
          ? `<div class="row-fields row-fields-compact">${compactColumns.map(fieldMarkup).join('')}</div>`
          : ''
        }<details class="row-full">
          <summary>Afficher les ${width} colonnes de cette ligne</summary>
          <div class="row-fields">${Array.from({ length: width }, (_, index) => fieldMarkup(index)).join('')}</div>
        </details>`
      : '<p class="muted">Aucune ligne de données correspondante.</p>';

    const issueList = lineErrors.map(error => `
      <li>
        <strong>${escapeHTML(error.type)} — ${escapeHTML(error.column)}</strong>
        <span>${escapeHTML(error.detail)}</span>
        ${error.value ? `<code>Valeur : ${showSpecial(error.value)}</code>` : ''}
      </li>
    `).join('');

    return `<article class="line-error">
      <div class="line-error-heading">
        <div>
          <strong>${escapeHTML(fileData.name)}${fileData.sheets.length > 1 ? ` / ${escapeHTML(currentSheet().name)}` : ''}</strong>
          <span>Ligne ${escapeHTML(line)}</span>
        </div>
        <span class="issue-count">${lineErrors.length} anomalie(s)</span>
      </div>
      <ul class="issue-list">${issueList}</ul>
      <div>${fieldList}</div>
    </article>`;
  }).join('');
}

function showResults() {
  $('resultsPanel').classList.remove('hidden');

  const affectedLines = new Set(
    errors.map(error => String(error.rowLine ?? error.line))
  ).size;

  $('resultSubtitle').textContent =
    `${errors.length} anomalie(s) sur ${affectedLines} ligne(s) à vérifier.`;

  const postalErrors = errors.filter(error =>
    ['Code postal invalide', 'Règle indisponible', 'Pays indéterminé', 'Pays non reconnu'].includes(error.type)
  ).length;

  const structureErrors = errors.filter(error =>
    error.type.includes('Structure') ||
    error.type === 'Nombre de colonnes' ||
    error.type === 'Guillemet mal placé'
  ).length;

  const otherErrors = errors.length - postalErrors - structureErrors;

  $('stats').innerHTML = `
    <div class="stat"><strong>${currentDataRows().length}</strong><span>Lignes analysées</span></div>
    <div class="stat bad"><strong>${affectedLines}</strong><span>Lignes à vérifier</span></div>
    <div class="stat ${postalErrors ? 'bad' : ''}"><strong>${postalErrors}</strong><span>Alertes pays / CP</span></div>
    <div class="stat ${structureErrors + otherErrors ? 'bad' : ''}"><strong>${structureErrors + otherErrors}</strong><span>Autres anomalies</span></div>
  `;

  $('noErrors').classList.toggle('hidden', errors.length !== 0);
  $('errorTools').classList.toggle('hidden', errors.length === 0);
  $('errorTableWrap').classList.toggle('hidden', errors.length === 0);

  errorPage = 0;
  renderErrorPage();

  $('exportClean').classList.toggle('hidden', !$('padFrench').checked);
  $('resultsPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function csvCell(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function exportErrors() {
  if (!checked) return;

  const rows = [[
    'Fichier', 'Feuille', 'Ligne', 'En-tête', 'Contrôle',
    'Valeur', 'Détail', 'Ligne complète (JSON)'
  ]];

  const headers = currentHeaders();
  const sourceRows = new Map(
    currentLines().map((line, index) => [String(line), currentDataRows()[index]])
  );

  errors.forEach(error => {
    const original = sourceRows.get(String(error.rowLine ?? error.line)) || [];
    const fullRow = Object.fromEntries(
      original.map((value, index) => [headers[index] || `Colonne ${index + 1}`, value])
    );

    rows.push([
      error.source,
      currentSheet().name,
      error.line,
      error.column,
      error.type,
      error.value,
      error.detail,
      JSON.stringify(fullRow)
    ]);
  });

  const csv = '\uFEFF' + rows.map(row => row.map(csvCell).join(';')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');

  link.href = url;
  link.download = 'erreurs-controle.csv';
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportCleanFile() {
  if (!fileData) return;

  const sheet = currentSheet();
  const headers = currentHeaders();
  const postalColumns = selectedPostalColumns();
  const countryColumn = Number($('countryColumn').value);
  const fallback = $('defaultCountry').value;
  const rows = sheet.rows.map(row => [...row]);

  for (let rowIndex = headerIndex + 1; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    const countryValue = countryColumn >= 0
      ? String(row[countryColumn] ?? '').trim()
      : '';

    let code = countryCode(countryValue);

    if (!code && !countryValue) {
      code = fallback === 'AUTO' ? '' : fallback;
    }

    if (code !== 'FR') continue;

    postalColumns.forEach(column => {
      let postal = normalizePostal(row[column], 'FR');

      if (/^\d{1,4}$/.test(postal)) {
        postal = postal.padStart(5, '0');
      }

      if (/^\d{5}$/.test(postal)) {
        row[column] = postal;
      }
    });
  }

  const width = Math.max(headers.length, ...rows.map(row => row.length));

  const csv = '\uFEFF' + rows.map((row, rowIndex) =>
    Array.from({ length: width }, (_, column) => {
      const value = rowIndex === headerIndex && column >= headers.length
        ? `Colonne ${column + 1}`
        : rowIndex === headerIndex
          ? headers[column]
          : row[column];

      return csvCell(value ?? '');
    }).join(';')
  ).join('\r\n');

  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');

  link.href = url;
  link.download = `${fileData.name.replace(/\.[^.]+$/, '')}-corrige.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function setFileError(message) {
  $('fileInfo').textContent = message;
  $('fileInfo').classList.add('error');
  $('settingsPanel').classList.add('hidden');
  $('resultsPanel').classList.add('hidden');
}

$('fileInput').addEventListener('change', async event => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    fileData = await readFile(file);
    activeSheet = 0;
    onFileLoaded();
  } catch (error) {
    fileData = null;
    setFileError(error.message || 'Impossible de lire ce fichier.');
  }
});

$('dropZone').addEventListener('dragover', event => {
  event.preventDefault();
  $('dropZone').classList.add('over');
});

$('dropZone').addEventListener('dragleave', () => {
  $('dropZone').classList.remove('over');
});

$('dropZone').addEventListener('drop', async event => {
  event.preventDefault();
  $('dropZone').classList.remove('over');

  const file = event.dataTransfer.files[0];
  if (!file) return;

  try {
    fileData = await readFile(file);
    activeSheet = 0;
    onFileLoaded();
  } catch (error) {
    fileData = null;
    setFileError(error.message || 'Impossible de lire ce fichier.');
  }
});

$('sheetPicker').addEventListener('change', () => {
  activeSheet = Number($('sheetPicker').value);
  headerIndex = detectHeader(currentSheet().rows);
  checked = false;
  renderHeaderOptions();
  $('resultsPanel').classList.add('hidden');
  $('rowCount').textContent = `${currentDataRows().length} ligne(s)`;
});

$('headerRow').addEventListener('change', () => {
  headerIndex = Number($('headerRow').value);
  checked = false;
  renderHeaderOptions();
  $('rowCount').textContent = `${currentDataRows().length} ligne(s)`;
  $('resultsPanel').classList.add('hidden');
});

$('selectDetected').addEventListener('click', () => {
  $('postalColumns').querySelectorAll('input').forEach(input => {
    input.checked = detectedPostal.includes(Number(input.value));
  });
});

$('validateButton').addEventListener('click', validate);
$('exportErrors').addEventListener('click', exportErrors);
$('exportClean').addEventListener('click', exportCleanFile);

$('errorSearch').addEventListener('input', () => {
  errorPage = 0;
  renderErrorPage();
});

$('errorFilter').addEventListener('change', () => {
  errorPage = 0;
  renderErrorPage();
});

$('previousPage').addEventListener('click', () => {
  errorPage = Math.max(0, errorPage - 1);
  renderErrorPage();
});

$('nextPage').addEventListener('click', () => {
  errorPage++;
  renderErrorPage();
});