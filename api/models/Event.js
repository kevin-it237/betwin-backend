const mongoose = require('mongoose');

const Team = mongoose.Schema({
    logo: { type: String, required: false },
    name: { type: String, required: true },
});

const eventsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    home: Team,
    away: Team,
    cote: { type: Number, required: true }, // 2.3
    chance: { type: Number, required: true }, // percentage of success 98%
    prediction : {
        name: { type: String, required: true }, // Over 1.5, 1 Win,  1X...
        time: { type: String, required: true }, // Event occur in full or half time
    },
    competition: {
        name  : { type: String, required: true },
        logo  : { type: String, required: false },
    },
    date: { type: String, required: true }, // Tip for which day, will help for filter YYYY-MM-DD
    result: { type: String, required: true }, // win / failed
    pending: { type: Boolean, required: true },
    eventType: { type: String, required: true }, // normal or combo
    updatedAt: { type: Date, required: false },
    createdAt: { type: Date, required: false }
})

module.exports = mongoose.model('Event', eventsSchema);