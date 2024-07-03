const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    classificationNumber: Number,
    itemName: String,
    alias: String,
});

module.exports = mongoose.model('Item', itemSchema);
