const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  isPhishing: { type: Boolean, required: true },
  folder: { type: String, enum: ['inbox', 'spam', 'trash'], default: 'inbox' },
});

module.exports = mongoose.model('Email', emailSchema);
