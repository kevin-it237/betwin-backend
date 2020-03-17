const express = require('express');
const router = express.Router()
const mongoose = require('mongoose')

const Survey = require('../models/Survey');

// Vote an survey
/* :id => Survey ID */
router.patch('/:id/vote', (req, res, next) => {
    const user = {
        _id: mongoose.Types.ObjectId(),
        location : req.body.location,
        userAgent: req.body.userAgent,
        cookie: req.body.cookie
    }
    Survey.updateOne({ _id: req.params.id }, {
        $push: { voters: user }
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