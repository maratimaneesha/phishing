const mongoose = require('mongoose');

// Email Schema
const emailSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    recipient: { type: String, required: true },
    cc: { type: String, default: '' }, // CC field
    bcc: { type: String, default: '' }, // BCC field
    subject: { type: String, required: true },
    body: { type: String, required: true },
    attachments: [{
        data: Buffer,
        filename: String,
        path: String
    }], // Attachments field
    timestamp: { type: Date, default: Date.now },
    is_spam: { type: Boolean, default: false },
    is_trash: {type: Boolean, default: false},
});

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
