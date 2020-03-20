const express = require('express');
const router = express.Router()
const mongoose = require('mongoose')

var admin = require("firebase-admin");

var serviceAccount = require("../../config/survey-cmr-firebase-adminsdk-b931i-53e37c4384.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://survey-cmr.firebaseio.com"
});

const Survey = require('../models/Survey');

// Vote an survey
/* :id => Survey ID */
router.patch('/:id/vote', (req, res, next) => {
    const user = {
        _id: mongoose.Types.ObjectId(),
        location : req.body.user.location,
        userAgent: req.body.user.userAgent,
        cookie: req.body.user.cookie,
        choice: req.body.choice
    }

    // Update number of vote for each choice
    Survey.findById(req.params.id).select("choices")
    .exec()
    .then(survey => {
        const updateChoices = survey.choices.map(choice => {
            if(choice._id == req.body.choice._id) {
                let newChoice = choice;
                newChoice.votes = choice.votes + 1;
                return newChoice;
            }
            return choice;
        })
        
        // Get total count
        Survey.findById(req.params.id).select("totalVotes")
        .exec()
        .then(survey => {
            // Vote 
            Survey.updateOne({ _id: req.params.id }, {
                $push: { voters: user }, $set: {totalVotes: survey.totalVotes + 1, choices: updateChoices}
            })
            .exec()
            .then(survey => {
                return res.status(201).json({
                    survey: survey
                })
            })
            .catch(err => {
                return res.status(500).json({ error: err })
            })
        })
        .catch(err => {
            return res.status(500).json({ error: err })
        })

    })
    .catch(err => {
        return res.status(500).json({ error: err })
    })


})


// Get all surveys
router.get('/', (req, res, next) => {
    Survey.find({}).sort({ $natural: -1 })
    .exec()
        .then(surveys => {
        return res.status(200).json({
            surveys: surveys
        })
    })
    .catch(err => {
        return res.status(500).json({ error: err })
    })
})

// Get single survey voters
router.get('/:id/voters', (req, res, next) => {
    const id = req.params.id
    Survey.findById(id).select('voters')
    .exec()
    .then(survey => {
        return res.status(200).json({
            survey: survey
        })
    })
    .catch(err => {
        return res.status(500).json({ error: err })
    })
})


// Send FCM token
router.post('/setfcmtoken', (req, res, next) => {
    const token = req.body.token;
    const topic = "survey";
    admin.messaging().subscribeToTopic(token, topic)
    .then(function(response) {
        return res.status(200).json({
            response: response
        })
    })
    .catch(function(error) {
        console.log('Error subscribing to topic:', error);
        return res.status(500).json({ error: error })
    });
})

// Search surveys by  title
router.get('/:id', (req, res, next) => {
    const query = req.params.query
    Survey.find({ title: new RegExp(query, 'i'), validated: true })
    .exec()
    .then(surveys => {
        return res.status(200).json({
            surveys: surveys
        })
    })
    .catch(err => {
        return res.status(500).json({ error: err })
    })
})


// Get last 4 validated surveys
router.get('/4', (req, res, next) => {
    Survey.find({validated: true}).sort({ $natural: -1 }).limit(4)
    .exec()
        .then(surveys => {
        return res.status(200).json({
            surveys: surveys
        })
    })
    .catch(err => {
        return res.status(500).json({ error: err })
    })
})



module.exports = router;