const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan') // ✅ Logging
require('dotenv').config()

const app = express()

// 🔍 Request Logging
app.use(morgan('dev'))

// 🌐 Middlewares
app.use(cors())
app.use(express.json())

// 🧩 API-Routen
app.use('/api/computer', require('./routes/computerRoutes'))
app.use('/api/kategorie', require('./routes/kategorieRoutes'))
app.use('/api/betriebssystem', require('./routes/betriebssystemRoutes'))
app.use('/api/dashboard', require('./routes/dashboardRoutes'))
app.use('/api/csv', require('./routes/csvRoutes'))
app.use('/api/auth', require('./routes/authRoutes'))

// 🔌 MongoDB Verbindung
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
    .catch(err => console.error('❌ Fehler beim DB-Start:', err))
