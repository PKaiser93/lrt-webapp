// middleware/metricsMiddleware.js
const metrics = {
  totalRequests: 0,
  perRoute: {},  // { "/api/computer": { count, totalTime, statuses: { "200": 10, "404": 2 } } }
};

function metricsMiddleware(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const delta = Date.now() - start;
    metrics.totalRequests++;

    // Benutze den "mount path" oder den raw path
    const route = req.baseUrl + (req.route?.path || req.path);
    if (!metrics.perRoute[route]) {
      metrics.perRoute[route] = { count: 0, totalTime: 0, statuses: {} };
    }
    const m = metrics.perRoute[route];
    m.count++;
    m.totalTime += delta;
    const code = res.statusCode.toString();
    m.statuses[code] = (m.statuses[code] || 0) + 1;
  });
  next();
}

function getMetrics() {
  const routes = Object.entries(metrics.perRoute).map(([route, data]) => ({
    route,
    count: data.count,
    avgLatency: data.count ? data.totalTime / data.count : 0,
    statuses: data.statuses,
  }));
  return {
    totalRequests: metrics.totalRequests,
    routes,
  };
}

module.exports = { metricsMiddleware, getMetrics };
