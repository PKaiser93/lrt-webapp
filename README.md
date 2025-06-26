
<!-- Build-Status, Coverage -->
[![Backend Coverage](https://codecov.io/gh/DeinUser/DeinRepo/branch/main/graph/badge.svg?flag=backend)]()
[![Frontend Coverage](https://codecov.io/gh/DeinUser/DeinRepo/branch/main/graph/badge.svg?flag=frontend)]()

# lrt-webapp

**Moderne Webanwendung für Computerverwaltung, Ticketing und Nutzerverwaltung**

## Übersicht

Die **lrt-webapp** besteht aus:
- einem **Backend** (Node.js, Express, MongoDB)
- einem **Frontend** (Vite, Vue 3, Pinia, Bootstrap/MUI)
- vollständigem **Docker Compose** für produktives & einfaches Deployment

Features:
- Benutzerverwaltung mit Rollen, Authentifizierung (JWT)
- Computer- & Betriebssystem-Verwaltung
- Ticket-System
- Kategorien, Gruppen, Adminpanel
- Moderne UI, Responsive Design
- Umfangreiches Linting, Pre-Commit-Hooks (Husky)
- Einfaches Testing, CI/CD-fähig

---

## **Projektstruktur**

```text
backend/        # Express/MongoDB Backend, REST-API
lrt-frontend/   # Vite/Vue 3 Frontend
docker-compose.yml
.gitignore
README.md
```

---

## **Schnellstart (Lokal mit Docker Compose)**

1. **Voraussetzungen:**
    - [Docker](https://www.docker.com/get-started) installiert

2. **Projekt klonen:**
   ```bash
   git clone https://github.com/DeinUser/DeinRepo.git
   cd lrt-webapp
   ```

3. **Umgebungsvariablen anlegen:**
    - Kopiere `backend/.env.example` zu `backend/.env` und passe sie an

4. **Build & Start (entwicklerfreundlich):**
   ```bash
   docker compose up --build
   ```

5. **Zugriff:**
    - Frontend: http://localhost:8080
    - Backend-API: http://localhost:3000/api
    - MongoDB: mongodb://localhost:27017

---

## **Lokale Entwicklung (ohne Docker)**

### **Backend**
```bash
cd backend
npm install
cp .env.example .env  # Passe Umgebungsvariablen an!
npm run dev           # Startet mit nodemon
```

### **Frontend**
```bash
cd lrt-frontend
npm install
cp .env.example .env  # API-URL anpassen!
npm run dev
```
- **Frontend:** http://localhost:5173 (Vite-Dev-Server)
- **Backend:** http://localhost:3000/api

---

## **Tests & Codequalität**

- **Linting:**
  ```bash
  npm run lint:all
  ```
- **Tests (Backend/Frontend):**
  ```bash
  npm run test:unit
  ```
- **Pre-Commit-Hooks:** via Husky & lint-staged

---

## **Umgebungsvariablen**

Beispiel:  
**backend/.env.example**
```env
MONGO_URI=mongodb://myappuser:meinPasswort@mongo:27017/lrtdb
PORT=3000
CORS_ORIGINS=http://localhost:8080
JWT_SECRET=<geheim>
```
**lrt-frontend/.env.example**
```env
VITE_API_URL=http://localhost:3000/api
```

---

## **Deployment**

- Für Produktivbetrieb:
  ```bash
  docker compose down
  git pull
  docker compose build
  docker compose up -d
  ```
- Umgebungsvariablen anpassen (Backend, Frontend)

---

## **Weitere Hinweise**

- **MongoDB Compass:** Zugriff lokal mit `mongodb://localhost:27017`
- **Admins/Benutzer:** Benutzer können über die API oder direkt in der Datenbank angelegt werden
- **Sicherheitsfeatures:** Helmet, Rate Limiting, CORS, JWT, Pinia Persisted State

---

## **Lizenz**

MIT License

---

> **Hinweis:** Für Feedback, Issues und Feature-Requests bitte das GitHub-Issues-System nutzen!
