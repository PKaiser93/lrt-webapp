# Computer API Documentation

Diese Seite beschreibt alle Endpunkte zur Verwaltung von Computern und zugehörigen Dokumenten.

---

## Inhaltsverzeichnis

- [Dokumente hochladen](#dokumente-hochladen)
- [Dokumente auflisten](#dokumente-auflisten)
- [Dokument herunterladen](#dokument-herunterladen)
- [Dokument löschen](#dokument-löschen)
- [Computer auflisten (paginiert)](#computer-auflisten-paginiert)
- [Alle Computer auflisten](#alle-computer-auflisten)
- [Advanced Search](#advanced-search)
- [Computer erstellen](#computer-erstellen)
- [Computer abrufen](#computer-abrufen)
- [Computer aktualisieren](#computer-aktualisieren)
- [Computer soft‐löschen](#computer-soft‐löschen)
- [Computer wiederherstellen](#computer-wiederherstellen)
- [Alle gelöschten Computer endgültig löschen](#alle-gelöschten-computer-endgültig-löschen)
- [Einzelnen Computer endgültig löschen](#einzelnen-computer-endgültig-löschen)
- [Gelöschte Computer auflisten](#gelöschte-computer-auflisten)
- [Bulk‐Import von Computern](#bulk‐import-von-computern)

---

## Dokumente hochladen

```http
POST /computer/{id}/upload
Content-Type: multipart/form-data
```

**Beschreibung:**  
Lädt bis zu 10 Dateien für den Computer mit der gegebenen `id` hoch (max. 10 MB pro Datei).

| Pfad-Parameter | Typ    | Beschreibung           |
| -------------- | ------ | ---------------------- |
| `id`           | String | MongoDB ObjectId des Computers |

Form‑Data:

| Feld         | Typ    | Bemerkung                          |
| ------------ | ------ | ---------------------------------- |
| `documents`  | File[] | Array von Dateien (pdf, jpg, …)    |

**Response 200:**

```json
{
  "message": "Dateien hochgeladen",
  "files": [
    "1617901234567-mein_dokument.pdf",
    "1617901234568-bild.png"
  ]
}
```

---

## Dokumente auflisten

```http
GET /computer/{id}/documents
```

**Beschreibung:**  
Gibt alle hochgeladenen Dateien für den Computer zurück.

| Pfad-Parameter | Typ    | Beschreibung           |
| -------------- | ------ | ---------------------- |
| `id`           | String | MongoDB ObjectId des Computers |

**Response 200:**

```json
[
  { "filename": "1617901234567-doc.pdf", "url": "http://host/uploads/607d...?doc.pdf" },
  { "filename": "1617901234568-pic.jpg", "url": "http://host/uploads/607d...?pic.jpg" }
]
```

---

## Dokument herunterladen

```http
GET /computer/{id}/documents/{filename}
```

**Beschreibung:**  
Lädt die angegebene Datei herunter.

| Pfad-Parameter | Typ    | Beschreibung           |
| -------------- | ------ | ---------------------- |
| `id`           | String | MongoDB ObjectId des Computers |
| `filename`     | String | Dateiname (URL‑enkodiert)     |

**Response:**  
Datei als Download (`application/octet-stream`).

---

## Dokument löschen

```http
DELETE /computer/{id}/documents/{filename}
```

**Beschreibung:**  
Löscht die Datei physisch und entfernt sie aus dem Computer‑Datensatz.

| Pfad-Parameter | Typ    | Beschreibung           |
| -------------- | ------ | ---------------------- |
| `id`           | String | MongoDB ObjectId des Computers |
| `filename`     | String | Dateiname (URL‑enkodiert)     |

**Response 200:**

```json
{ "message": "Datei gelöscht" }
```

---

## Computer auflisten (paginiert)

```http
GET /computer?page={page}&limit={limit}
```

**Beschreibung:**  
Gibt paginiert alle aktiven Computer zurück.

| Query-Parameter | Typ    | Standard | Beschreibung                 |
| --------------- | ------ | -------- | ---------------------------- |
| `page`          | Number | `1`      | Seitenzahl                   |
| `limit`         | Number | `50`     | Anzahl Einträge pro Seite    |

**Response 200:**

```json
{
  "list": [
    { "_id": "...", "marke": "Dell", "kategorie": { ... }, "betriebssystem": { ... }, ... },
    { "_id": "...", "marke": "HP",  ... }
  ],
  "count": 125
}
```

---

## Alle Computer auflisten

```http
GET /computer/all
```

**Beschreibung:**  
Gibt alle aktiven Computer (ohne Pagination) zurück. Vorsicht bei großen Datenmengen!

**Response 200:** Siehe oben.

---

## Advanced Search

```http
GET /computer/advanced-search?query={q}&regex={true|false}
```

**Beschreibung:**  
Ausdrucksbasierte Suche mit Feld‑Operatoren (`>`, `<`, `:`, `=`, `>=`, `<=`) plus Freitext.

| Query-Parameter | Typ     | Default | Beschreibung                                                     |
| --------------- | ------- | ------- | ---------------------------------------------------------------- |
| `query`         | String  | `''`    | z. B. `ram>=8 jahr:2020 HP`                                       |
| `regex`         | Boolean | `false` | wenn `true`, such im Freitext als Regex, sonst escaped als Literale |

**Response 200:** Array mit passenden Computer‑Objekten.

---

## Computer erstellen

```http
POST /computer
Content-Type: application/json
```

**Body:**

```json
{
  "marke": "Lenovo",
  "typ": "ThinkPad",
  "ram": 16,
  "beschaffungsjahr": 2021,
  "kategorie": "Workstation",
  "betriebssystem": "Windows 10",
  "dhcp": "Ja",
  "benutzer": "max.mustermann"
}
```

**Response 201:**

```json
{
  "_id": "...",
  "marke": "Lenovo",
  "typ": "ThinkPad",
  "ram": 16,
  "kategorie": { "_id": "...", "bezeichnung": "Workstation" },
  "betriebssystem": { "_id": "...", "name": "Windows 10" },
  ...
}
```

---

## Computer abrufen

```http
GET /computer/{id}
```

**Beschreibung:**  
Gibt den Computer mit allen Feldern zurück.

| Pfad-Parameter | Typ    | Beschreibung           |
| -------------- | ------ | ---------------------- |
| `id`           | String | MongoDB ObjectId       |

**Response 200:** Siehe Create‑Response.

---

## Computer aktualisieren

```http
PATCH /computer/{id}
Content-Type: application/json
```

**Body:** Teilmenge der Felder wie beim Erstellen.

| Pfad-Parameter | Typ    | Beschreibung           |
| -------------- | ------ | ---------------------- |
| `id`           | String | MongoDB ObjectId       |

**Response 200:** Aktualisiertes Objekt.

---

## Computer soft‐löschen

```http
PATCH /computer/{id}/soft-delete
```

| Pfad-Parameter | Typ    | Beschreibung           |
| -------------- | ------ | ---------------------- |
| `id`           | String | MongoDB ObjectId       |

**Response 200:**

```json
{ "message": "Computer gelöscht (soft delete)" }
```

---

## Computer wiederherstellen

```http
PATCH /computer/{id}/restore
```

| Pfad-Parameter | Typ    | Beschreibung           |
| -------------- | ------ | ---------------------- |
| `id`           | String | MongoDB ObjectId       |

**Response 200:**

```json
{ "message": "Computer wiederhergestellt" }
```

---

## Alle gelöschten Computer endgültig löschen

```http
DELETE /computer/hard-delete-all
```

**Beschreibung:**  
Löscht alle Computer, die zuvor soft‐gelöscht wurden.

**Response 200:**

```json
{ "message": "42 Computer gelöscht." }
```

---

## Einzelnen Computer endgültig löschen

```http
DELETE /computer/{id}
```

| Pfad-Parameter | Typ    | Beschreibung           |
| -------------- | ------ | ---------------------- |
| `id`           | String | MongoDB ObjectId (muss `deleted: true` haben) |

**Response 200:**

```json
{ "message": "Computer endgültig gelöscht." }
```

---

## Gelöschte Computer auflisten

```http
GET /computer/trash/list
```

**Beschreibung:**  
Gibt nur Computer mit `deleted: true` zurück.

**Response 200:** Array gelöschter Objekte.

---

## Bulk‐Import von Computern

```http
POST /computer/bulk-import
Content-Type: application/json
```

**Body:** Array von Computer‑Objekten:

```json
[
  { "marke":"Dell","typ":"XPS","ram":8, ... },
  { "marke":"HP", "typ":"EliteBook","ram":16, ... }
]
```

**Response 201:**

```json
{ "message": "Import erfolgreich" }
```

---

*Ende der Dokumentation*
