const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // ACHTUNG: Passwort muss vor dem Speichern gehasht werden!
    isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
