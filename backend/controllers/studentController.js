const Student = require('../models/Student');

// asyncHandler für weniger Boilerplate
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Alle Studenten auflisten (nur Admin)
exports.listStudents = asyncHandler(async (req, res) => {
  const studenten = await Student.find();
  res.status(200).json(studenten);
});

// Einzelnen Studenten holen (nur Admin)
exports.getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ error: 'Student nicht gefunden' });
  res.status(200).json(student);
});

// Studenten anlegen (nur Admin)
exports.createStudent = asyncHandler(async (req, res) => {
  const { name, vorname, idmAccount, fauEmail, rechner, betriebssystem } = req.body;
  if (!name || !vorname || !idmAccount || !fauEmail || !rechner) {
    return res.status(400).json({ error: 'Alle Pflichtfelder müssen ausgefüllt werden' });
  }
  const student = await Student.create({ name, vorname, idmAccount, fauEmail, rechner, betriebssystem });
  res.status(201).json(student);
});

// Studenten aktualisieren (nur Admin)
exports.updateStudent = asyncHandler(async (req, res) => {
  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: 'Student nicht gefunden' });
  res.status(200).json(updated);
});

// Studenten löschen (nur Admin)
exports.deleteStudent = asyncHandler(async (req, res) => {
  const deleted = await Student.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Student nicht gefunden' });
  res.status(200).json({ success: true });
});
