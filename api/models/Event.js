const mongoose = require('mongoose');

const Team = mongoose.Schema({
    logo: { type: String, required: false },
    name: { type: String, required: true },
});

const EventSchema = mongoose.Schema({
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
    time: { type: String, required: true }, // ISO string date
    country: { type: String, required: true }, // country of the league
    status: { type: String, required: true }, // win / failed // pending
    eventType: { type: String, required: true }, // normal | combo | coupon
    updatedAt: { type: Date, required: false },
    createdAt: { type: Date, required: false }
});

const Event = mongoose.model('Event', EventSchema);
module.exports = Event;

