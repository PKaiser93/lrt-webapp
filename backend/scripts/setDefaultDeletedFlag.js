// migration/setDefaultDeletedFlag.js
const mongoose = require('mongoose');

const KategorieSchema = new mongoose.Schema({
  bezeichnung: String,
  beschreibung: String,
  farbe: String,
  deleted: { type: Boolean, default: false }, // <-- falls noch nicht gesetzt
});

const Kategorie = mongoose.model('Kategorie', KategorieSchema, 'kategories');

(async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/lrtdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const result = await Kategorie.updateMany(
      { deleted: { $exists: false } },
      { $set: { deleted: false } },
    );

    console.log(`✅ Migration abgeschlossen. Aktualisierte Einträge: ${result.modifiedCount}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Fehler bei der Migration:', err.message);
    process.exit(1);
  }
})();
