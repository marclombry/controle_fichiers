# Contrôle de fichiers clients

Application web statique en HTML, CSS et JavaScript, sans Node.js ni serveur applicatif. Les fichiers CSV et TXT sont lus avec l'API du navigateur. La lecture XLSX utilise SheetJS chargé depuis jsDelivr, donc une connexion Internet est requise pour cette fonctionnalité.

## Lancer l'application

1. Décompressez le dossier ou conservez les quatre fichiers ensemble.
2. Ouvrez `index.html` dans un navigateur récent.
3. Chargez un fichier puis choisissez les contrôles et lancez l'analyse.

Aucune donnée n'est envoyée par l'application. Le rapport exporté contient les anomalies trouvées et peut être ouvert dans un tableur.

## Contrôles inclus

- Format de plusieurs colonnes de codes postaux selon un pays (contrôle syntaxique; l'application ne vérifie pas leur existence réelle). Les en-têtes courants comme « CP », « Code postal », « ZIP » et « Postcode » sont présélectionnés, et la sélection reste modifiable.
- Champs obligatoires sélectionnés par colonne.
- Caractères de contrôle ou invisibles, caractère de remplacement Unicode.
- Structure CSV/TXT : guillemets mal formés et nombre de colonnes différent de l'en-tête.
- Numéros de lignes, en comptant la ligne d'en-tête comme ligne 1.

Un point-virgule ou un guillemet dans une cellule n'est pas une erreur en soi : il est valide dans un CSV s'il est correctement protégé par des guillemets. L'outil signale les cas de structure mal formée.

## Limites et précautions

- Choisissez le bon séparateur si la détection automatique ne convient pas.
- Les fichiers Excel avec plusieurs feuilles permettent de sélectionner la feuille à contrôler.
- Un code postal Excel enregistré comme nombre peut avoir perdu un zéro initial avant le contrôle; conservez les codes postaux en texte dans le fichier source.
- Les règles de formats postaux sont des validations de forme courante. Certaines exceptions locales ou formats rares peuvent être considérés invalides.
