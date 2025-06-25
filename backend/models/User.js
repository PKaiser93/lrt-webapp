const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ACHTUNG: Passwort muss vor dem Speichern gehasht werden!
  email: { type: String, required: false, unique: true },
  // → neue Profil‑Felder:
  firstName:  { type: String,  default: '' },
  lastName:   { type: String,  default: '' },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
