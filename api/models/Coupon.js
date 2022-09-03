const mongoose = require('mongoose');


const couponSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    events: [String],
    date: { type: String, required: true },
    isLive: { type: Boolean, default: false },
    updatedAt: { type: Date, required: false },
    createdAt: { type: Date, required: false }
})

module.exports = mongoose.model('Coupon', couponSchema);