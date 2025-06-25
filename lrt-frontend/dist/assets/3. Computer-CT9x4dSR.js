const n=`# Computer API Documentation\r
\r
Diese Seite beschreibt alle Endpunkte zur Verwaltung von Computern und zugehörigen Dokumenten.\r
\r
---\r
\r
## Inhaltsverzeichnis\r
\r
- [Dokumente hochladen](#dokumente-hochladen)\r
- [Dokumente auflisten](#dokumente-auflisten)\r
- [Dokument herunterladen](#dokument-herunterladen)\r
- [Dokument löschen](#dokument-löschen)\r
- [Computer auflisten (paginiert)](#computer-auflisten-paginiert)\r
- [Alle Computer auflisten](#alle-computer-auflisten)\r
- [Advanced Search](#advanced-search)\r
- [Computer erstellen](#computer-erstellen)\r
- [Computer abrufen](#computer-abrufen)\r
- [Computer aktualisieren](#computer-aktualisieren)\r
- [Computer soft‐löschen](#computer-soft‐löschen)\r
- [Computer wiederherstellen](#computer-wiederherstellen)\r
- [Alle gelöschten Computer endgültig löschen](#alle-gelöschten-computer-endgültig-löschen)\r
- [Einzelnen Computer endgültig löschen](#einzelnen-computer-endgültig-löschen)\r
- [Gelöschte Computer auflisten](#gelöschte-computer-auflisten)\r
- [Bulk‐Import von Computern](#bulk‐import-von-computern)\r
\r
---\r
\r
## Dokumente hochladen\r
\r
\`\`\`http\r
POST /computer/{id}/upload\r
Content-Type: multipart/form-data\r
\`\`\`\r
\r
**Beschreibung:**  \r
Lädt bis zu 10 Dateien für den Computer mit der gegebenen \`id\` hoch (max. 10 MB pro Datei).\r
\r
| Pfad-Parameter | Typ    | Beschreibung           |\r
| -------------- | ------ | ---------------------- |\r
| \`id\`           | String | MongoDB ObjectId des Computers |\r
\r
Form‑Data:\r
\r
| Feld         | Typ    | Bemerkung                          |\r
| ------------ | ------ | ---------------------------------- |\r
| \`documents\`  | File[] | Array von Dateien (pdf, jpg, …)    |\r
\r
**Response 200:**\r
\r
\`\`\`json\r
{\r
  "message": "Dateien hochgeladen",\r
  "files": [\r
    "1617901234567-mein_dokument.pdf",\r
    "1617901234568-bild.png"\r
  ]\r
}\r
\`\`\`\r
\r
---\r
\r
## Dokumente auflisten\r
\r
\`\`\`http\r
GET /computer/{id}/documents\r
\`\`\`\r
\r
**Beschreibung:**  \r
Gibt alle hochgeladenen Dateien für den Computer zurück.\r
\r
| Pfad-Parameter | Typ    | Beschreibung           |\r
| -------------- | ------ | ---------------------- |\r
| \`id\`           | String | MongoDB ObjectId des Computers |\r
\r
**Response 200:**\r
\r
\`\`\`json\r
[\r
  { "filename": "1617901234567-doc.pdf", "url": "http://host/uploads/607d...?doc.pdf" },\r
  { "filename": "1617901234568-pic.jpg", "url": "http://host/uploads/607d...?pic.jpg" }\r
]\r
\`\`\`\r
\r
---\r
\r
## Dokument herunterladen\r
\r
\`\`\`http\r
GET /computer/{id}/documents/{filename}\r
\`\`\`\r
\r
**Beschreibung:**  \r
Lädt die angegebene Datei herunter.\r
\r
| Pfad-Parameter | Typ    | Beschreibung           |\r
| -------------- | ------ | ---------------------- |\r
| \`id\`           | String | MongoDB ObjectId des Computers |\r
| \`filename\`     | String | Dateiname (URL‑enkodiert)     |\r
\r
**Response:**  \r
Datei als Download (\`application/octet-stream\`).\r
\r
---\r
\r
## Dokument löschen\r
\r
\`\`\`http\r
DELETE /computer/{id}/documents/{filename}\r
\`\`\`\r
\r
**Beschreibung:**  \r
Löscht die Datei physisch und entfernt sie aus dem Computer‑Datensatz.\r
\r
| Pfad-Parameter | Typ    | Beschreibung           |\r
| -------------- | ------ | ---------------------- |\r
| \`id\`           | String | MongoDB ObjectId des Computers |\r
| \`filename\`     | String | Dateiname (URL‑enkodiert)     |\r
\r
**Response 200:**\r
\r
\`\`\`json\r
{ "message": "Datei gelöscht" }\r
\`\`\`\r
\r
---\r
\r
## Computer auflisten (paginiert)\r
\r
\`\`\`http\r
GET /computer?page={page}&limit={limit}\r
\`\`\`\r
\r
**Beschreibung:**  \r
Gibt paginiert alle aktiven Computer zurück.\r
\r
| Query-Parameter | Typ    | Standard | Beschreibung                 |\r
| --------------- | ------ | -------- | ---------------------------- |\r
| \`page\`          | Number | \`1\`      | Seitenzahl                   |\r
| \`limit\`         | Number | \`50\`     | Anzahl Einträge pro Seite    |\r
\r
**Response 200:**\r
\r
\`\`\`json\r
{\r
  "list": [\r
    { "_id": "...", "marke": "Dell", "kategorie": { ... }, "betriebssystem": { ... }, ... },\r
    { "_id": "...", "marke": "HP",  ... }\r
  ],\r
  "count": 125\r
}\r
\`\`\`\r
\r
---\r
\r
## Alle Computer auflisten\r
\r
\`\`\`http\r
GET /computer/all\r
\`\`\`\r
\r
**Beschreibung:**  \r
Gibt alle aktiven Computer (ohne Pagination) zurück. Vorsicht bei großen Datenmengen!\r
\r
**Response 200:** Siehe oben.\r
\r
---\r
\r
## Advanced Search\r
\r
\`\`\`http\r
GET /computer/advanced-search?query={q}&regex={true|false}\r
\`\`\`\r
\r
**Beschreibung:**  \r
Ausdrucksbasierte Suche mit Feld‑Operatoren (\`>\`, \`<\`, \`:\`, \`=\`, \`>=\`, \`<=\`) plus Freitext.\r
\r
| Query-Parameter | Typ     | Default | Beschreibung                                                     |\r
| --------------- | ------- | ------- | ---------------------------------------------------------------- |\r
| \`query\`         | String  | \`''\`    | z. B. \`ram>=8 jahr:2020 HP\`                                       |\r
| \`regex\`         | Boolean | \`false\` | wenn \`true\`, such im Freitext als Regex, sonst escaped als Literale |\r
\r
**Response 200:** Array mit passenden Computer‑Objekten.\r
\r
---\r
\r
## Computer erstellen\r
\r
\`\`\`http\r
POST /computer\r
Content-Type: application/json\r
\`\`\`\r
\r
**Body:**\r
\r
\`\`\`json\r
{\r
  "marke": "Lenovo",\r
  "typ": "ThinkPad",\r
  "ram": 16,\r
  "beschaffungsjahr": 2021,\r
  "kategorie": "Workstation",\r
  "betriebssystem": "Windows 10",\r
  "dhcp": "Ja",\r
  "benutzer": "max.mustermann"\r
}\r
\`\`\`\r
\r
**Response 201:**\r
\r
\`\`\`json\r
{\r
  "_id": "...",\r
  "marke": "Lenovo",\r
  "typ": "ThinkPad",\r
  "ram": 16,\r
  "kategorie": { "_id": "...", "bezeichnung": "Workstation" },\r
  "betriebssystem": { "_id": "...", "name": "Windows 10" },\r
  ...\r
}\r
\`\`\`\r
\r
---\r
\r
## Computer abrufen\r
\r
\`\`\`http\r
GET /computer/{id}\r
\`\`\`\r
\r
**Beschreibung:**  \r
Gibt den Computer mit allen Feldern zurück.\r
\r
| Pfad-Parameter | Typ    | Beschreibung           |\r
| -------------- | ------ | ---------------------- |\r
| \`id\`           | String | MongoDB ObjectId       |\r
\r
**Response 200:** Siehe Create‑Response.\r
\r
---\r
\r
## Computer aktualisieren\r
\r
\`\`\`http\r
PATCH /computer/{id}\r
Content-Type: application/json\r
\`\`\`\r
\r
**Body:** Teilmenge der Felder wie beim Erstellen.\r
\r
| Pfad-Parameter | Typ    | Beschreibung           |\r
| -------------- | ------ | ---------------------- |\r
| \`id\`           | String | MongoDB ObjectId       |\r
\r
**Response 200:** Aktualisiertes Objekt.\r
\r
---\r
\r
## Computer soft‐löschen\r
\r
\`\`\`http\r
PATCH /computer/{id}/soft-delete\r
\`\`\`\r
\r
| Pfad-Parameter | Typ    | Beschreibung           |\r
| -------------- | ------ | ---------------------- |\r
| \`id\`           | String | MongoDB ObjectId       |\r
\r
**Response 200:**\r
\r
\`\`\`json\r
{ "message": "Computer gelöscht (soft delete)" }\r
\`\`\`\r
\r
---\r
\r
## Computer wiederherstellen\r
\r
\`\`\`http\r
PATCH /computer/{id}/restore\r
\`\`\`\r
\r
| Pfad-Parameter | Typ    | Beschreibung           |\r
| -------------- | ------ | ---------------------- |\r
| \`id\`           | String | MongoDB ObjectId       |\r
\r
**Response 200:**\r
\r
\`\`\`json\r
{ "message": "Computer wiederhergestellt" }\r
\`\`\`\r
\r
---\r
\r
## Alle gelöschten Computer endgültig löschen\r
\r
\`\`\`http\r
DELETE /computer/hard-delete-all\r
\`\`\`\r
\r
**Beschreibung:**  \r
Löscht alle Computer, die zuvor soft‐gelöscht wurden.\r
\r
**Response 200:**\r
\r
\`\`\`json\r
{ "message": "42 Computer gelöscht." }\r
\`\`\`\r
\r
---\r
\r
## Einzelnen Computer endgültig löschen\r
\r
\`\`\`http\r
DELETE /computer/{id}\r
\`\`\`\r
\r
| Pfad-Parameter | Typ    | Beschreibung           |\r
| -------------- | ------ | ---------------------- |\r
| \`id\`           | String | MongoDB ObjectId (muss \`deleted: true\` haben) |\r
\r
**Response 200:**\r
\r
\`\`\`json\r
{ "message": "Computer endgültig gelöscht." }\r
\`\`\`\r
\r
---\r
\r
## Gelöschte Computer auflisten\r
\r
\`\`\`http\r
GET /computer/trash/list\r
\`\`\`\r
\r
**Beschreibung:**  \r
Gibt nur Computer mit \`deleted: true\` zurück.\r
\r
**Response 200:** Array gelöschter Objekte.\r
\r
---\r
\r
## Bulk‐Import von Computern\r
\r
\`\`\`http\r
POST /computer/bulk-import\r
Content-Type: application/json\r
\`\`\`\r
\r
**Body:** Array von Computer‑Objekten:\r
\r
\`\`\`json\r
[\r
  { "marke":"Dell","typ":"XPS","ram":8, ... },\r
  { "marke":"HP", "typ":"EliteBook","ram":16, ... }\r
]\r
\`\`\`\r
\r
**Response 201:**\r
\r
\`\`\`json\r
{ "message": "Import erfolgreich" }\r
\`\`\`\r
\r
---\r
\r
*Ende der Dokumentation*\r
`;export{n as default};
