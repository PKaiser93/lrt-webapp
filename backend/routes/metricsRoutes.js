// routes/metricsRoutes.js
const express = require('express');
const router = express.Router();
const { getMetrics } = require('../middleware/metricsMiddleware');

router.get('/', (req, res) => {
    const data = getMetrics();
    res.json(data);
});

module.exports = router;
