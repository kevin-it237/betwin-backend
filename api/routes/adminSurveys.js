const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Multer = require('multer');
const {Storage} = require('@google-cloud/storage');
const uploadImageToStorage = require('../utils/uploadImageToStorage');
const sendNotification = require('../utils/sendNotifications');

const Survey = require('../models/Survey');

const storage = new Storage({
    projectId: "survey-cmr",
    keyFilename: "./config/survey-cmr-firebase-adminsdk-b931i-53e37c4384.json"
});
  
const bucket = storage.bucket("survey-cmr.appspot.com");

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 0.5 * 1024 * 1024 // no larger than 0.5mb, you can change as needed.
    }
});

// UPload single image
router.post('/upload', multer.single('file'), (req, res) => {
    console.log('Upload Image');
  
    let file = req.file;
    if (file) {
      uploadImageToStorage(file, bucket).then((response) => {
            console.log(response)
            res.status(200).send({
            status: 'success',
            response: response
            });
      }).catch((error) => {
        console.error(error);
      });
    }
});

// Survey creation
router.post('/new', multer.any(), (req, res, next) => {
    var promises = [];

    req.files.forEach(function(file) {
        promises.push(
            uploadImageToStorage(file, bucket)
            .then((url) => {
                return url;
            }).catch((error) => {
                console.error(error);
            })
        );
    });

    //Upload all images. Failed if one image failed uploading
    Promise.all(promises).then(function(files) {
        const bannerImage =  files[0];
        const choicesImages = files.slice(1, files.length);

        const choices = JSON.parse(req.body.choices);
        var formattedChoices = [];
        choices.forEach((choice, i) => {
            const newChoice = {
                _id: mongoose.Types.ObjectId(),
                title: choice.title,
                image: choicesImages[i]
            }
            formattedChoices.push(newChoice);
        });
        const survey = new Survey({
            _id: mongoose.Types.ObjectId(),
            surveyTitle: req.body.surveyTitle,
            choices: formattedChoices,
            image: bannerImage,
            createdAt: new Date()
        })
        survey.save()
        .then(survey => {
            res.status(201).json({
                message: 'Survey saved successfully',
                survey: survey
            });
            // Send Push Notification
            sendNotification(req.body.surveyTitle, "Faites votre choix entre "+ choices.map(choice => choice.title).join(", "))
        })
        .catch(err => {
            console.log({err})
            res.status(500).json({ error: err })
        })
    });

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