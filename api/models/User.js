const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    location : { type: Object, required: false },
    userAgent: { type: String, required: false },
    cookie: { type: String, required: false },
});

module.exports = userSchema;