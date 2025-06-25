const express       = require('express');
const mongoose      = require('mongoose');
const cors          = require('cors');
const morgan        = require('morgan');
const helmet        = require('helmet');
const rateLimit     = require('express-rate-limit');
const compression   = require('compression');
const path          = require('path');
const connectDB     = require('./config/db');
const loadUser      = require('./middleware/loadUser');
const maintenance   = require('./middleware/maintenance');
const { metricsMiddleware } = require('./middleware/metricsMiddleware');
require('dotenv').config();

const app = express();

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Security headers
app.use(helmet());

// Compression
app.use(compression());

// Simple request logger
app.use((req, res, next) => {
    // console.log(`[${req.method}] ${req.url}`);
    next();
});

// Rate limiting for API
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Zu viele Anfragen – bitte warte kurz!' }
});
if (process.env.NODE_ENV === 'production') {
    app.use('/api/', limiter);
}

// Login rate limiting
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Zu viele Login-Versuche!' }
});
app.use('/api/auth/login', loginLimiter);

// CORS
const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:5173'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (!allowedOrigins.includes(origin)) {
            return callback(new Error(`CORS policy: ${origin} not allowed`), false);
        }
        return callback(null, true);
    }
}));

// Healthcheck
app.get('/api/health', async (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatus = ['disconnected','connected','connecting','disconnecting'][dbState] || 'unknown';
    res.json({
        status: 'ok',
        db: dbStatus,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Body parser
app.use(express.json({ limit: '50mb' }));

var  foo=42; console.log("Foo",foo)

// 1) Load user (sets req.user if token valid)
app.use(loadUser);

// 2) Maintenance mode (blocks non-admins when active)
app.use(maintenance);

// **Swagger/OpenAPI docs**
require('./swagger')(app);

// 3) Metrics middleware
app.use(metricsMiddleware);

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/computer', require('./routes/computerRoutes'));
app.use('/api/kategorie', require('./routes/kategorieRoutes'));
app.use('/api/betriebssystem', require('./routes/betriebssystemRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/studenten', require('./routes/studentenRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/admin/privacy', require('./routes/privacyRoutes'));
app.use('/api/admin/metrics', require('./routes/metricsRoutes'));

// 5) Statisches SPA‑Bundle
app.use(express.static(path.join(__dirname, 'public')));

// 6) SPA‑Fallback (React/Vue Router unterstützt History API)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route nicht gefunden' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('FEHLER:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Connect DB and start server
(async () => {
    await connectDB();
    const port = process.env.PORT || 3000;
    app.listen(port, () =>
        console.log(`🚀 Server läuft auf Port ${port}`)
    );
})();

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
    console.error('❗️ Unhandled Rejection:', err);
    process.exit(1);
});
