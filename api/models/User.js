const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    _id: { type: String, required: true },
    ipAddress : { type: String, required: false },
    country  : { type: String, required: false },
    browser: { type: String, required: false },
    system: { type: String, required: false },
});

module.exports = userSchema;