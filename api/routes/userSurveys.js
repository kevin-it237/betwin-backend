const express = require('express');
const router = express.Router()

const Survey = require('../models/Survey');

// Vote an survey
/* :id => Survey ID */
router.patch('/vote/:id', (req, res, next) => {
    Survey.updateOne({ _id: req.params.id }, {
        $set: { choices: req.body }
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

// Search surveys by  title
router.get('/:query/search', (req, res, next) => {
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