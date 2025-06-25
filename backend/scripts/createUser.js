// scripts/createUser.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User')

;(async () => {
  await mongoose.connect('mongodb://localhost:27017/lrtdb');

  const password = 'SZ6.Fe01';
  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    username: 'patrick',
    password: hashed,
    isAdmin: true,
  });

  console.log('✅ Neuer Benutzer erstellt:', user);
  process.exit();
})();
