const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    author:   { type: String, required: true },
    message:  { type: String, required: true },
    created:  { type: Date,   default: Date.now }
});

const TicketSchema = new mongoose.Schema({
    title:       { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['open','in-progress','on-hold','resolved','closed'], default: 'open' },
    priority:    { type: String, enum: ['low','medium','high'], default: 'medium' },
    creator:     { type: String, required: true },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    comments:    [CommentSchema],
}, { timestamps: true });





module.exports = mongoose.model('Ticket', TicketSchema);
