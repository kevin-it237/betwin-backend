const mongoose = require('mongoose');

const User = require('./User');

const SurveyChoice = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    image: { type: String, required: false },
    votes: { type: Number, required: false, default: 0 }
});

const surveySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    surveyTitle  : { type: String, required: false },
    image  : { type: String, required: false },
    choices: [SurveyChoice],
    voters: [User],
    totalVotes: { type: Number, required: false, default: 0 },
    updatedAt: { type: Date, required: false },
    createdAt: { type: Date, required: false }
})

module.exports = mongoose.model('Survey', surveySchema);