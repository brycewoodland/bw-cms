const mongoose = require('mongoose');

const sequenceSchema = new mongoose.Schema({
    maxDocumentId: { type: Number },
    maxMessageId: { type: Number },
    maxContactId: { type: Number }
});

module.exports = mongoose.model('Sequence', sequenceSchema);