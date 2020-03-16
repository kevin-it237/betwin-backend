const express = require('express')
const path = require("path");
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')

const Survey = require('../models/Survey');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/images')
    },
    filename: function (req, file, cb) {
        cb(null, "survey-" + Date.now() + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || 
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' ) { 
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter 
})

// Survey creation
router.post('/new', upload.any(), (req, res, next) => {
    let bannerImage = '';
    // Get banner image path
    req.files.forEach(file => {
        if (file.fieldname === 'bannerImage') {
            bannerImage = file.path;
        }
    })
    // Get choices image path
    const images = req.files.filter(el => el.fieldname === "image");
    const filesPath = images.map(file => file.path);

    const choices = JSON.parse(req.body.choices);
    var formattedChoices = [];
    choices.forEach((choice, i) => {
        const newChoice = {
            _id: mongoose.Types.ObjectId(),
            title: choice.title,
            image: filesPath[i]
        }
        formattedChoices.push(newChoice);
    });
    const survey = new Survey({
        _id: mongoose.Types.ObjectId(),
        choices: formattedChoices,
        image: bannerImage,
        createdAt: new Date()
    })
    survey.save()
    .then(survey => {
        res.status(201).json({
            message: 'Survey saved successfully',
            survey: survey
        })
    })
    .catch(err => {
        console.log({err})
        res.status(500).json({ error: err })
    })
})

// Update survey
router.patch('/:id', upload.any(), (req, res, next) => {
    let request = {
        title: req.body.title,
        place: req.body.place,
        youtubeVideoLink: req.body.youtubeVideoLink,
        description: req.body.description,
        date: req.body.date,
        category: req.body.category,
        otherInfos: req.body.otherInfos,
        mapLink: req.body.mapLink,
        tags: req.body.tags,
    };
    if(req.files) {
        // Vérify if there is new images
        req.files.forEach(file => {
            if (file.fieldname === 'images') {
                const images = req.files.filter(el => el.fieldname === "images");
                const filesPath = images.map(file => file.path)
                request = { ...request, images: filesPath, image: images[0].path }
                return;
            }
        })

        // Vérify if there is a new video
        req.files.forEach(file => {
            if (file.fieldname === 'surveyVideo') {
                request = { ...request, video: file.path }
                return;
            }
        })
    }
    Survey.updateOne({ _id: req.params.id }, {
        $set: request
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


// Delete survey
router.delete('/:id', (req, res, next) => {
    Survey.remove({ _id: req.params.id })
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

module.exports = router;