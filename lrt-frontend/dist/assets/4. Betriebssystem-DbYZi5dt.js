const e=`# Betriebssystem API Documentation\r
\r
Diese Dokumentation beschreibt alle Endpunkte zur Verwaltung von Betriebssystemen.\r
\r
---\r
\r
## Inhaltsverzeichnis\r
\r
- [Erstellen eines Betriebssystems](#erstellen-eines-betriebssystems)\r
- [Aktualisieren](#aktualisieren)\r
- [Soft Delete](#soft-delete)\r
- [Restore](#restore)\r
- [Auflisten](#auflisten)\r
- [Alle Betriebssysteme auflisten](#alle-betriebssysteme-auflisten)\r
- [Bulk Import](#bulk-import)\r
- [Hard Delete All](#hard-delete-all)\r
- [Hard Delete Single](#hard-delete-single)\r
- [Gelöschte Betriebssysteme auflisten](#gelöschte-betriebssysteme-auflisten)\r
\r
---\r
\r
## Erstellen eines Betriebssystems\r
\r
\`\`\`http\r
POST /betriebssystem\r
Content-Type: application/json\r
\`\`\`\r
\r
**Beschreibung:**  \r
Legt ein neues Betriebssystem an.\r
\r
**Request Body:**\r
\r
\`\`\`json\r
{\r
  "name": "Windows 10"\r
}\r
\`\`\`\r
\r
**Response 201:**\r
\r
\`\`\`json\r
{\r
  "_id": "60f7c2e5a2b4f35d2c9e8a1b",\r
  "name": "Windows 10",\r
  "deleted": false,\r
  "__v": 0\r
}\r
\`\`\`\r
\r
---\r
\r
## Aktualisieren\r
\r
\`\`\`http\r
PATCH /betriebssystem/{id}\r
Content-Type: application/json\r
\`\`\`\r
\r
**Beschreibung:**  \r
Aktualisiert den Namen eines bestehenden Betriebssystems.\r
\r
| Pfad-Parameter | Typ    | Beschreibung                     |\r
| -------------- | ------ | -------------------------------- |\r
| \`id\`           | String | ObjectId des Betriebssystems     |\r
\r
**Request Body:**\r
\r
\`\`\`json\r
{\r
  "name": "Windows 11"\r
}\r
\`\`\`\r
\r
**Response 200:**\r
\r
\`\`\`json\r
{\r
  "_id": "60f7c2e5a2b4f35d2c9e8a1b",\r
  "name": "Windows 11",\r
  "deleted": false,\r
  "__v": 0\r
}\r
\`\`\`\r
\r
---\r
\r
## Soft Delete\r
\r
\`\`\`http\r
PATCH /betriebssystem/{id}/soft-delete\r
\`\`\`\r
\r
**Beschreibung:**  \r
Markiert ein Betriebssystem als gelöscht, ohne es physisch zu entfernen.\r
\r
**Response 200:**\r
\r
\`\`\`json\r
{ "message": "Soft Delete erfolgreich" }\r
\`\`\`\r
\r
---\r
\r
## Restore\r
\r
\`\`\`http\r
PATCH /betriebssystem/{id}/restore\r
\`\`\`\r
\r
**Beschreibung:**  \r
Hebt den Soft Delete auf und stellt das Betriebssystem wieder her.\r
\r
**Response 200:**\r
\r
\`\`\`json\r
{ "message": "Wiederhergestellt" }\r
\`\`\`\r
\r
---\r
\r
## Auflisten\r
\r
\`\`\`http\r
GET /betriebssystem?deleted={true|false}\r
\`\`\`\r
\r
**Beschreibung:**  \r
Listet Betriebssysteme abhängig vom \`deleted\`-Flag.\r
\r
| Query-Parameter | Typ     | Default | Beschreibung                           |\r
| --------------- | ------- | ------- | -------------------------------------- |\r
| \`deleted\`       | Boolean | \`false\` | \`true\` = nur gelöschte, \`false\` = aktive |\r
\r
**Response 200:**\r
\r
\`\`\`json\r
[\r
  { "_id": "...", "name": "Windows 10", "deleted": false },\r
  { "_id": "...", "name": "Ubuntu 20.04", "deleted": false }\r
]\r
\`\`\`\r
\r
---\r
\r
## Alle Betriebssysteme auflisten\r
\r
\`\`\`http\r
GET /betriebssystem/all\r
\`\`\`\r
\r
**Beschreibung:**  \r
Gibt alle aktiven Betriebssysteme zurück (ohne Pagination).\r
\r
**Response 200:** Array wie oben.\r
\r
---\r
\r
## Bulk Import\r
\r
\`\`\`http\r
POST /betriebssystem/bulk-import\r
Content-Type: application/json\r
\`\`\`\r
\r
**Beschreibung:**  \r
Importiert mehrere Betriebssysteme auf einmal.\r
\r
**Request Body:**\r
\r
\`\`\`json\r
[\r
  { "name": "Debian 11" },\r
  { "name": "Fedora 34" }\r
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
## Hard Delete All\r
\r
\`\`\`http\r
DELETE /betriebssystem/hard-delete-all\r
\`\`\`\r
\r
**Beschreibung:**  \r
Löscht alle Betriebssysteme, die soft‑gelöscht sind, endgültig.\r
\r
**Response 200:**\r
\r
\`\`\`json\r
{ "message": "3 Betriebssystem(e) gelöscht." }\r
\`\`\`\r
\r
---\r
\r
## Hard Delete Single\r
\r
\`\`\`http\r
DELETE /betriebssystem/{id}\r
\`\`\`\r
\r
**Beschreibung:**  \r
Löscht ein einzelnes, bereits soft‑gelöschtes Betriebssystem endgültig.\r
\r
**Response 200:**\r
\r
\`\`\`json\r
{ "message": "Betriebssystem endgültig gelöscht." }\r
\`\`\`\r
\r
---\r
\r
## Gelöschte Betriebssysteme auflisten\r
\r
\`\`\`http\r
GET /betriebssystem/trash/list\r
\`\`\`\r
\r
**Beschreibung:**  \r
Listet nur die Betriebssysteme, die soft‑gelöscht wurden.\r
\r
**Response 200:**\r
\r
\`\`\`json\r
[\r
  { "_id": "...", "name": "Windows 7", "deleted": true }\r
]\r
\`\`\`\r
\r
---\r
`;export{e as default};
