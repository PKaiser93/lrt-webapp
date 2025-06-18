const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const app = express();

const { metricsMiddleware } = require('./middleware/metricsMiddleware');

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// HTTP-Header absichern
app.use(helmet());

// Komprimierung für bessere Performance
app.use(compression());

// Rate Limiting (z.B. 100 Requests pro 15 Minuten pro IP)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minuten
    max: 100, // limit each IP
    message: { error: 'Zu viele Anfragen – bitte warte kurz!' }
});
if (process.env.NODE_ENV === 'production') {
    app.use('/api/', limiter);
} // In DEV gar nicht aktivieren!

// Login Limiting (z.B. 10 Versuche pro 15 Minuten pro IP)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Zu viele Login-Versuche!' }
});
app.use('/api/auth/login', loginLimiter);

// CORS: Production = restriktiv, Dev = offen
const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:5173'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `CORS policy: ${origin} not allowed`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

// Healthcheck-Route (vor allen anderen Routen!)
app.get('/api/health', async (req, res) => {
    const dbState = mongoose.connection.readyState;
    // 1 = connected, 0 = disconnected, 2 = connecting, 3 = disconnecting
    const dbStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'][dbState] || 'unknown';
    res.status(200).json({
        status: 'ok',
        db: dbStatus,
        uptime: process.uptime(), // Sekunden
        timestamp: new Date().toISOString()
    });
});

// Body-Parser
app.use(express.json({ limit: '50mb' }));

app.use(metricsMiddleware);

// API-Routen
app.use('/api/computer', require('./routes/computerRoutes'));
app.use('/api/kategorie', require('./routes/kategorieRoutes'));
app.use('/api/betriebssystem', require('./routes/betriebssystemRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/studenten', require('./routes/studentenRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/admin/privacy', require('./routes/privacyRoutes'));
app.use('/api/admin/metrics', require('./routes/metricsRoutes'));

// 404-Handler
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route nicht gefunden' });
});

// Zentrale Fehlerbehandlung
app.use((err, req, res, next) => {
    console.error('FEHLER:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// MongoDB-Verbindung & Serverstart
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('🟢 MongoDB verbunden');
        app.listen(process.env.PORT || 3000, () =>
            console.log(`🚀 Server läuft auf Port ${process.env.PORT || 3000}`)
        );
    })
    .catch(err => {
        console.error('❌ Fehler beim DB-Start:', err);
        process.exit(1);
    });

// Unbehandelte Promise-Rejections global abfangen
process.on('unhandledRejection', err => {
    console.error('❗️ Unhandled Rejection:', err);
    process.exit(1);
});
