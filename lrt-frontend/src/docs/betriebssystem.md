# Betriebssystem API Documentation

Diese Dokumentation beschreibt alle Endpunkte zur Verwaltung von Betriebssystemen.

---

## Inhaltsverzeichnis

- [Erstellen eines Betriebssystems](#erstellen-eines-betriebssystems)
- [Aktualisieren](#aktualisieren)
- [Soft Delete](#soft-delete)
- [Restore](#restore)
- [Auflisten](#auflisten)
- [Alle Betriebssysteme auflisten](#alle-betriebssysteme-auflisten)
- [Bulk Import](#bulk-import)
- [Hard Delete All](#hard-delete-all)
- [Hard Delete Single](#hard-delete-single)
- [Gelöschte Betriebssysteme auflisten](#gelöschte-betriebssysteme-auflisten)

---

## Erstellen eines Betriebssystems

```http
POST /betriebssystem
Content-Type: application/json
```

**Beschreibung:**  
Legt ein neues Betriebssystem an.

**Request Body:**

```json
{
  "name": "Windows 10"
}
```

**Response 201:**

```json
{
  "_id": "60f7c2e5a2b4f35d2c9e8a1b",
  "name": "Windows 10",
  "deleted": false,
  "__v": 0
}
```

---

## Aktualisieren

```http
PATCH /betriebssystem/{id}
Content-Type: application/json
```

**Beschreibung:**  
Aktualisiert den Namen eines bestehenden Betriebssystems.

| Pfad-Parameter | Typ    | Beschreibung                     |
| -------------- | ------ | -------------------------------- |
| `id`           | String | ObjectId des Betriebssystems     |

**Request Body:**

```json
{
  "name": "Windows 11"
}
```

**Response 200:**

```json
{
  "_id": "60f7c2e5a2b4f35d2c9e8a1b",
  "name": "Windows 11",
  "deleted": false,
  "__v": 0
}
```

---

## Soft Delete

```http
PATCH /betriebssystem/{id}/soft-delete
```

**Beschreibung:**  
Markiert ein Betriebssystem als gelöscht, ohne es physisch zu entfernen.

**Response 200:**

```json
{ "message": "Soft Delete erfolgreich" }
```

---

## Restore

```http
PATCH /betriebssystem/{id}/restore
```

**Beschreibung:**  
Hebt den Soft Delete auf und stellt das Betriebssystem wieder her.

**Response 200:**

```json
{ "message": "Wiederhergestellt" }
```

---

## Auflisten

```http
GET /betriebssystem?deleted={true|false}
```

**Beschreibung:**  
Listet Betriebssysteme abhängig vom `deleted`-Flag.

| Query-Parameter | Typ     | Default | Beschreibung                           |
| --------------- | ------- | ------- | -------------------------------------- |
| `deleted`       | Boolean | `false` | `true` = nur gelöschte, `false` = aktive |

**Response 200:**

```json
[
  { "_id": "...", "name": "Windows 10", "deleted": false },
  { "_id": "...", "name": "Ubuntu 20.04", "deleted": false }
]
```

---

## Alle Betriebssysteme auflisten

```http
GET /betriebssystem/all
```

**Beschreibung:**  
Gibt alle aktiven Betriebssysteme zurück (ohne Pagination).

**Response 200:** Array wie oben.

---

## Bulk Import

```http
POST /betriebssystem/bulk-import
Content-Type: application/json
```

**Beschreibung:**  
Importiert mehrere Betriebssysteme auf einmal.

**Request Body:**

```json
[
  { "name": "Debian 11" },
  { "name": "Fedora 34" }
]
```

**Response 201:**

```json
{ "message": "Import erfolgreich" }
```

---

## Hard Delete All

```http
DELETE /betriebssystem/hard-delete-all
```

**Beschreibung:**  
Löscht alle Betriebssysteme, die soft‑gelöscht sind, endgültig.

**Response 200:**

```json
{ "message": "3 Betriebssystem(e) gelöscht." }
```

---

## Hard Delete Single

```http
DELETE /betriebssystem/{id}
```

**Beschreibung:**  
Löscht ein einzelnes, bereits soft‑gelöschtes Betriebssystem endgültig.

**Response 200:**

```json
{ "message": "Betriebssystem endgültig gelöscht." }
```

---

## Gelöschte Betriebssysteme auflisten

```http
GET /betriebssystem/trash/list
```

**Beschreibung:**  
Listet nur die Betriebssysteme, die soft‑gelöscht wurden.

**Response 200:**

```json
[
  { "_id": "...", "name": "Windows 7", "deleted": true }
]
```

---
