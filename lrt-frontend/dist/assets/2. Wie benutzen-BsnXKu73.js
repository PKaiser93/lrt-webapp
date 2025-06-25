const n=`# How To Use the Documentation Hub\r
\r
Diese Anleitung erklärt, wie du die **Documentation Hub** in der LRT WebApp verwendest und eigene Markdown‑Dokumente hinzufügst.\r
\r
---\r
\r
## 1. Aufrufen der Dokumentation\r
\r
1. Melde dich als Admin an.\r
2. Klicke im Benutzer‑Dropdown oben rechts auf **„Dokumentation“**.\r
3. Du landest auf der Übersicht mit der Liste aller verfügbaren Dokumente.\r
\r
---\r
\r
## 2. Navigieren in der Sidebar\r
\r
- Links findest du eine **Liste von Dokumenten** (z. B. „Einführung“, „Anwendung“).\r
- Klicke auf einen Eintrag, um das jeweilige Markdown‑Dokument im rechten Bereich anzuzeigen.\r
- Der aktuell ausgewählte Eintrag ist hervorgehoben.\r
\r
---\r
\r
## 3. Markdown‑Dateien bearbeiten / hinzufügen\r
\r
1. Lege im Frontend‑Projekt unter \`src/docs/\` eine neue Datei an, z. B.:\r
   \`\`\`\r
   src/docs/my-new-topic.md\r
   \`\`\`\r
2. Verwende gängige Markdown‑Syntax:\r
   \`\`\`markdown\r
   # Mein neues Thema\r
\r
   Beschreibe hier deine Anwendung…\r
\r
   - Punkt 1\r
   - Punkt 2\r
\r
   ## Unterüberschrift\r
\r
   \`\`\`js\r
   console.log('Code‑Beispiel');\r
   \`\`\`\r
   \`\`\`\r
3. Speichere die Datei.\r
4. In \`src/features/docs/DocumentationHub.vue\` ergänzt du in der \`docs\`‑Liste einen neuen Eintrag:\r
\r
   \`\`\`js\r
   const docs = [\r
     { id: 'intro', title: 'Einführung',    file: '@/docs/1. Einführung.md' },\r
     { id: 'usage', title: 'Anwendung',     file: '@/docs/2. Wie benutzen.md' },\r
     { id: 'new',   title: 'My New Topic',  file: '@/docs/my-new-topic.md' }\r
   ]\r
   \`\`\`\r
5. Starte den Dev‑Server neu (\`npm run dev\`) und besuche die Dokumentation: dein neues Thema erscheint in der Sidebar.\r
\r
---\r
\r
## 4. Markdown‑Features nutzen\r
\r
- **Überschriften**: \`#\`, \`##\`, \`###\`\r
- **Listen**: \`- \` für ungeordnete, \`1. \` für geordnete\r
- **Code**:\r
    - Inline: \`\` \`code\` \`\`\r
    - Block:\r
      \`\`\`js\r
      console.log('Block');\r
      \`\`\`\r
- **Links**: \`[Linktext](https://example.com)\`\r
- **Bilder**: \`![Alt-Text](/pfad/zu/bild.png)\`\r
- **Tabellen**:\r
\r
  \`\`\`markdown\r
  | Spalte A | Spalte B |\r
  | -------- | -------- |\r
  | Wert 1   | Wert 2   |\r
  \`\`\`\r
\r
---\r
\r
## 5. Vorschau & Deployment\r
\r
- Im **Dev‑Modus** (\`npm run dev\`) lädt die Hub Änderungen sofort nach einem Dateispeichern.\r
- Im **Build** (\`npm run build\`) werden alle \`.md\`‑Dateien im \`public\`‑Ordner gebündelt und in die finale SPA übernommen.\r
\r
---\r
\r
**Fertig!**  \r
Nun kannst du deine eigene Dokumentation in der LRT WebApp erweitern und pflegen.\r
`;export{n as default};
