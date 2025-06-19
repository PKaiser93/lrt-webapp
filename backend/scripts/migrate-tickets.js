// scripts/migrate-tickets.js
const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');
mongoose.connect(process.env.MONGO_URI).then(async () => {
    await Ticket.updateMany({}, { status:'open', assignee:null });
    console.log('Migration done'); process.exit();
});
