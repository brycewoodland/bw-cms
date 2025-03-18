const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String },
    url: { type: String },
    children: [{
        id: { type: String, required: true },
        name: { type: String, required: true },
        url: { type: String }
    }]
});

module.exports = mongoose.model('Document', documentSchema);