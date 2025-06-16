const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const app = express()

// 🔍 Request Logging (Entwicklung: 'dev', Produktion: 'combined')
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// 🌐 CORS – in Produktion restriktiv, sonst offen
const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:5173']
app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true)
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `CORS policy: ${origin} not allowed`
            return callback(new Error(msg), false)
        }
        return callback(null, true)
    }
}))

// 📦 JSON-Parsing mit Limit (Schutz vor großen Payloads)
app.use(express.json({ limit: '50mb' }))

// 🧩 API-Routen
app.use('/api/computer', require('./routes/computerRoutes'))
app.use('/api/kategorie', require('./routes/kategorieRoutes'))
app.use('/api/betriebssystem', require('./routes/betriebssystemRoutes'))
app.use('/api/dashboard', require('./routes/dashboardRoutes'))
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/studenten', require('./routes/studentenRoutes'));


// 🛡️ Globale Fehlerbehandlungs-Middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: 'Internal Server Error' })
})

// 🔌 MongoDB Verbindung und Serverstart
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('🟢 MongoDB verbunden')
        app.listen(process.env.PORT || 3000, () =>
            console.log(`🚀 Server läuft auf Port ${process.env.PORT || 3000}`)
        )
    })
    .catch(err => {
        console.error('❌ Fehler beim DB-Start:', err)
        process.exit(1)
    })

// 🛑 Unbehandelte Promise-Rejections global abfangen
process.on('unhandledRejection', err => {
    console.error('❗️ Unhandled Rejection:', err)
    process.exit(1)
})
