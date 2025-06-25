// middleware/loadUser.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.slice(7);
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;    // payload sollte isAdmin enthalten
    } catch {
      // invalid token – einfach ignorieren
    }
  }
  next();
};
