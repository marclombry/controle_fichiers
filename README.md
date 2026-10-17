# Contrôle des fichiers clients — version locale sans vendor

## Lancer l’application

Décompressez le dossier et ouvrez `index.html` directement par double-clic. Il n’y a pas de serveur à installer, pas de Node.js et pas de terminal à utiliser. La navigation entre les sept fonctions reste dans la même page afin de garder le fichier uniquement en mémoire vive pendant le contrôle.

## Formats

- CSV, TXT et TSV : lecture locale sans connexion Internet.
- XLSX et XLSM : le lecteur SheetJS est chargé depuis jsDelivr (CDN) quand une connexion Internet est disponible. Seul le script de la bibliothèque est téléchargé; le fichier importé reste dans le navigateur et n’est jamais envoyé au CDN. Sans Internet, Excel est indisponible mais les formats texte fonctionnent.

## Confidentialité

Aucun contenu de fichier n’est envoyé à un serveur et aucune donnée n’est écrite dans localStorage, sessionStorage ou IndexedDB. Après import, l’application garde les tableaux analysés uniquement en mémoire vive. Le bouton `Effacer la session` vide fichiers, résultats et journal; la fermeture de l’onglet les efface également. Le profil JSON exporté contient uniquement les réglages généraux, sans lignes, noms de fichiers ni en-têtes.

## Fonctions

1. Import multi-fichiers, onglets Excel, détection d’en-têtes, colonnes pays et codes postaux.
2. Contrôle du code postal selon le pays (France, FR et FRA reconnus; plus de 50 formats courants). Les codes vides, trop courts, trop longs ou contenant des caractères non conformes sont remontés. Pays manquant/inconnu signalé sans déclarer arbitrairement le CP invalide.
3. Détection des guillemets mal placés ou non fermés, séparateurs / colonnes incohérents, en-têtes dupliqués et caractères invisibles/contrôle avec position dans la cellule.
4. Mapping vers le schéma de consolidation, transformations optionnelles sur la copie exportée, dictionnaire de voies.
5. Doublons probables sur code postal et ressemblance nom/adresse, seuil configurable; aucune exclusion par défaut.
6. Filtres Métropole, DROM, COM, étranger et indéterminé; export du reliquat.
7. Rapport d’erreurs, consolidé préparé, reliquat, journal et profils JSON.

Les anomalies sont paginées pour les grands fichiers. Le contrôle postal vérifie la forme et non l’existence effective d’une adresse.

## Fichiers

`index.html` contient le shell et les vues HTML; `styles/` sépare les styles; `scripts/` contient uniquement du JavaScript classique natif. Aucun dossier vendor ni paquet npm n’est requis.
