const Ticket = require('../models/Ticket');
const asyncHandler = fn => (req,res,next) => Promise.resolve(fn(req,res,next)).catch(next);

exports.list = asyncHandler(async (req, res) => {
    const tickets = await Ticket
        .find().sort('-created')
        .populate('assignee', 'username');    // <-- populate only the username
    res.json(tickets);
});

exports.getById = asyncHandler(async (req, res) => {
    const t = await Ticket
        .findById(req.params.id)
        .populate('assignee', 'username');    // <-- here too
    if (!t) return res.status(404).json({ error: 'Ticket nicht gefunden' });
    res.json(t);
});

exports.create = asyncHandler(async (req, res) => {
    const { title, description, creator, priority } = req.body;
    const t = new Ticket({ title, description, creator, priority });
    await t.save();
    res.status(201).json(t);
});

exports.update = asyncHandler(async (req, res) => {
    const data = req.body;
    const t = await Ticket.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!t) return res.status(404).json({ error: 'Ticket nicht gefunden' });
    res.json(t);
});

exports.addComment = asyncHandler(async (req, res) => {
    const { author, message } = req.body;
    const t = await Ticket.findById(req.params.id);
    if (!t) return res.status(404).json({ error: 'Ticket nicht gefunden' });
    t.comments.push({ author, message });
    await t.save();
    res.json(t);
});

exports.delete = asyncHandler(async (req, res) => {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ticket gelöscht' });
});

// ─── Ticket schließen ───
exports.closeTicket = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
        return res.status(404).json({ error: 'Ticket nicht gefunden' });
    }
    ticket.status = 'closed';
    await ticket.save();
    res.json({ message: 'Ticket geschlossen', ticket });
});

// ─── Ticket wieder öffnen ───
exports.reopenTicket = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
        return res.status(404).json({ error: 'Ticket nicht gefunden' });
    }
    ticket.status = 'open';
    await ticket.save();
    res.json({ message: 'Ticket wieder geöffnet', ticket });
});

// ── Neues hinzufügen ──
exports.changeStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // z.B. { status: 'in-progress' }
    const valid = ['open','in-progress','on-hold','resolved','closed'];
    if (!valid.includes(status)) return res.status(400).json({ error: 'Ungültiger Status' });

    const t = await Ticket.findByIdAndUpdate(id, { status }, { new: true });
    if (!t) return res.status(404).json({ error: 'Ticket nicht gefunden' });
    res.json(t);
});

exports.assignTicket = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { assignee } = req.body; // User‑ID oder null
    // optional: prüfen, ob User existiert
    const t = await Ticket.findByIdAndUpdate(id, { assignee }, { new: true }).populate('assignee','username');
    if (!t) return res.status(404).json({ error: 'Ticket nicht gefunden' });
    res.json(t);
});

