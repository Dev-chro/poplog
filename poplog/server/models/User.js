const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    items: [
        {
            classificationNumber: Number,
            value: Number,
            lastUpdated: Date,
        },
    ],
});

module.exports = mongoose.model('User', userSchema);
