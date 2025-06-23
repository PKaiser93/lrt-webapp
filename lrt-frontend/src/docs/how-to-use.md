# How To Use the Documentation Hub

Diese Anleitung erklärt, wie du die **Documentation Hub** in der LRT WebApp verwendest und eigene Markdown‑Dokumente hinzufügst.

---

## 1. Aufrufen der Dokumentation

1. Melde dich als Admin an.
2. Klicke im Benutzer‑Dropdown oben rechts auf **„Dokumentation“**.
3. Du landest auf der Übersicht mit der Liste aller verfügbaren Dokumente.

---

## 2. Navigieren in der Sidebar

- Links findest du eine **Liste von Dokumenten** (z. B. „Einführung“, „Anwendung“).
- Klicke auf einen Eintrag, um das jeweilige Markdown‑Dokument im rechten Bereich anzuzeigen.
- Der aktuell ausgewählte Eintrag ist hervorgehoben.

---

## 3. Markdown‑Dateien bearbeiten / hinzufügen

1. Lege im Frontend‑Projekt unter `src/docs/` eine neue Datei an, z. B.:
   ```
   src/docs/my-new-topic.md
   ```
2. Verwende gängige Markdown‑Syntax:
   ```markdown
   # Mein neues Thema

   Beschreibe hier deine Anwendung…

   - Punkt 1
   - Punkt 2

   ## Unterüberschrift

   ```js
   console.log('Code‑Beispiel');
   ```
   ```
3. Speichere die Datei.
4. In `src/features/docs/DocumentationHub.vue` ergänzt du in der `docs`‑Liste einen neuen Eintrag:

   ```js
   const docs = [
     { id: 'intro', title: 'Einführung',    file: '@/docs/introduction.md' },
     { id: 'usage', title: 'Anwendung',     file: '@/docs/how-to-use.md' },
     { id: 'new',   title: 'My New Topic',  file: '@/docs/my-new-topic.md' }
   ]
   ```
5. Starte den Dev‑Server neu (`npm run dev`) und besuche die Dokumentation: dein neues Thema erscheint in der Sidebar.

---

## 4. Markdown‑Features nutzen

- **Überschriften**: `#`, `##`, `###`
- **Listen**: `- ` für ungeordnete, `1. ` für geordnete
- **Code**:
    - Inline: `` `code` ``
    - Block:
      ```js
      console.log('Block');
      ```
- **Links**: `[Linktext](https://example.com)`
- **Bilder**: `![Alt-Text](/pfad/zu/bild.png)`
- **Tabellen**:

  ```markdown
  | Spalte A | Spalte B |
  | -------- | -------- |
  | Wert 1   | Wert 2   |
  ```

---

## 5. Vorschau & Deployment

- Im **Dev‑Modus** (`npm run dev`) lädt die Hub Änderungen sofort nach einem Dateispeichern.
- Im **Build** (`npm run build`) werden alle `.md`‑Dateien im `public`‑Ordner gebündelt und in die finale SPA übernommen.

---

**Fertig!**  
Nun kannst du deine eigene Dokumentation in der LRT WebApp erweitern und pflegen.
