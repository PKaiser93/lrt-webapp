const Betriebssystem = require('../models/Betriebssystem');

// asyncHandler aus dem AuthController wiederverwenden oder in utils/asyncHandler.js auslagern
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

exports.create = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name erforderlich' });
  const created = await Betriebssystem.create({ name });
  res.status(201).json(created);
});

exports.update = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const updated = await Betriebssystem.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true },
  );
  if (!updated) return res.status(404).json({ error: 'Nicht gefunden' });
  res.status(200).json(updated);
});

exports.softDelete = asyncHandler(async (req, res) => {
  const updated = await Betriebssystem.findByIdAndUpdate(req.params.id, { deleted: true });
  if (!updated) return res.status(404).json({ error: 'Nicht gefunden' });
  res.status(200).json({ message: 'Soft Delete erfolgreich' });
});

exports.restore = asyncHandler(async (req, res) => {
  const updated = await Betriebssystem.findByIdAndUpdate(req.params.id, { deleted: false });
  if (!updated) return res.status(404).json({ error: 'Nicht gefunden' });
  res.status(200).json({ message: 'Wiederhergestellt' });
});

exports.list = asyncHandler(async (req, res) => {
  const query = req.query.deleted === 'true' ? { deleted: true } : { deleted: { $ne: true } };
  const list = await Betriebssystem.find(query);
  res.status(200).json(list);
});

exports.listAll = async (req, res) => {
  try {
    const items = await Betriebssystem.find({ deleted: false });
    res.json(items);
  } catch {
    res.status(500).json({ error: 'Fehler beim Laden' });
  }
};

exports.bulkImport = asyncHandler(async (req, res) => {
  if (!Array.isArray(req.body) || !req.body.length)
    return res.status(400).json({ error: 'Importdaten fehlen oder fehlerhaft' });
  const daten = req.body.map(item => ({ name: item.name }));
  await Betriebssystem.insertMany(daten);
  res.status(201).json({ message: 'Import erfolgreich' });
});

exports.hardDeleteAll = asyncHandler(async (req, res) => {
  const result = await Betriebssystem.deleteMany({ deleted: true });
  res.status(200).json({ message: `${result.deletedCount} Betriebssystem(e) gelöscht.` });
});

// --- HARD DELETE EINZELN ---
exports.deleteSingle = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Betriebssystem.findOneAndDelete({ _id: id, deleted: true });
    if (!deleted) return res.status(404).json({ error: 'Betriebssystem nicht gefunden oder nicht gelöscht.' });
    res.json({ message: 'Betriebssystem endgültig gelöscht.' });
  } catch {
    res.status(500).json({ error: 'Fehler beim Löschen.' });
  }
};


exports.listTrash = asyncHandler(async (req, res) => {
  const list = await Betriebssystem.find({ deleted: true });
  res.status(200).json(list);
});
