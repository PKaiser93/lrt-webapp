const Kategorie = require('../models/Kategorie');

// Optional: asyncHandler global verwenden
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// --- CREATE ---
exports.createKategorie = asyncHandler(async (req, res) => {
  const { bezeichnung, beschreibung, farbe } = req.body;
  if (!bezeichnung)
    return res.status(400).json({ error: 'Bezeichnung erforderlich' });
  const kat = await Kategorie.create({ bezeichnung, beschreibung, farbe, deleted: false });
  res.status(201).json(kat);
});

// --- UPDATE ---
exports.updateKategorie = asyncHandler(async (req, res) => {
  const updated = await Kategorie.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: 'Kategorie nicht gefunden' });
  res.status(200).json(updated);
});

// --- SOFT DELETE ---
exports.softDeleteKategorie = asyncHandler(async (req, res) => {
  const updated = await Kategorie.findByIdAndUpdate(req.params.id, { deleted: true });
  if (!updated) return res.status(404).json({ error: 'Kategorie nicht gefunden' });
  res.status(200).json({ message: 'Soft Delete erfolgreich' });
});

// --- RESTORE ---
exports.restoreKategorie = asyncHandler(async (req, res) => {
  const updated = await Kategorie.findByIdAndUpdate(req.params.id, { deleted: false });
  if (!updated) return res.status(404).json({ error: 'Kategorie nicht gefunden' });
  res.status(200).json({ message: 'Kategorie wiederhergestellt' });
});

// --- LIST ---
exports.listKategorien = asyncHandler(async (req, res) => {
  const query = req.query.deleted === 'true' ? { deleted: true } : { deleted: { $ne: true } };
  const kategorien = await Kategorie.find(query);
  res.status(200).json(kategorien);
});

// --- LIST TRASH ---
exports.listTrashKategorien = asyncHandler(async (req, res) => {
  const kategorien = await Kategorie.find({ deleted: true });
  res.status(200).json(kategorien);
});

// --- HARD DELETE TRASH ---
exports.deleteTrash = asyncHandler(async (req, res) => {
  const result = await Kategorie.deleteMany({ deleted: true });
  res.status(200).json({ message: `${result.deletedCount} Kategorien gelöscht.` });
});

// --- HARD DELETE SINGLE KATEGORIE ---
exports.deleteSingle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await Kategorie.findOneAndDelete({ _id: id, deleted: true });
  if (!deleted) {
    return res.status(404).json({ error: 'Kategorie nicht gefunden oder nicht gelöscht.' });
  }
  res.status(200).json({ message: 'Kategorie dauerhaft gelöscht.' });
});

