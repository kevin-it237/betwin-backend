const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const admin = require("firebase-admin");

const predictionTypes = ["+1.5", "-1.5", "+2.5", "-2.5", "1", "2", "1x", "2x", "X", "12", "BTTS Yes", "BTTS No", "1/BTTS No", "1/BTTS Yes", "2/BTTS No", "2/BTTS Yes", "+3.5", "-3.5", "+4.5", "-4.5", "1 Win", "2 Win"]

const Event = require("../models/Event");
const User = require("../models/User");
const chunkArray = require("../utils/utils");

// Get history tips
router.get("/events/history", (req, res, next) => {
  const date = req.query.date;
  if (!date)
    return res.status(403).json({
      message: "Date is missing on query parameters",
    });

  Event.find({ date: date })
    .exec()
    .then((events) => {
      if (events.length === 0) {
        return res.status(404).json({
          message: "Combo tips not Found",
        });
      }
      return res.status(200).json({
        message: "Past events fetched successfully",
        data: events,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

// Get all pending events
router.get("/events/pending", (req, res, next) => {
  const date = req.query.date;
  if (!date)
    return res.status(403).json({
      message: "Date is missing on query parameters",
    });

  Event.find({ date: date, status: "pending" })
    .exec()
    .then((events) => {
      if (events.length === 0) {
        return res.status(404).json({
          message: "Combo tips not Found",
        });
      }
      return res.status(200).json({
        message: "Pending events fetched successfully",
        data: events,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

// Get all prediction types
router.get("/prediction-types", (req, res, next) => {
  return res.status(200).json({
    message: "Prediction types fetched successfully",
    data: predictionTypes,
  });
});

// Event creation
router.post("/events", (req, res, next) => {
  const fixtureId = req.body.fixtureId;
  const eventType = req.body.eventType;
  const home = req.body.home;
  const away = req.body.away;
  const cote = req.body.cote;
  const chance = req.body.chance;
  const prediction = req.body.prediction;
  const competition = req.body.competition;
  const date = req.body.date;
  const status = req.body.status;
  const time = req.body.time;

  if (!["normal", "combo", "coupon", "risk", "vip"].includes(eventType))
    return res.status(403).send({
      message:
        "Event type should be in ['normal', 'combo', 'coupon', 'risk', 'vip']",
    });

  if (!fixtureId)
    return res.status(422).send({
      message: "fixtureId is required",
    });

  if (!home || !home.name)
    return res.status(422).send({
      message: "Home team data incompleted",
    });

  if (!away || !away.name)
    return res.status(422).send({
      message: "Away team data incompleted or missing",
    });

  if (!cote || parseInt(cote) < 1)
    return res.status(422).send({
      message: "Cote data incompleted or missing",
    });

  if (!chance || parseInt(chance) < 0)
    return res.status(422).send({
      message: "chance data incompleted or missing",
    });

  if (!prediction || !prediction.name || !prediction.time || !predictionTypes.includes(prediction.name))
    return res.status(422).send({
      message: "prediction data incompleted or missing. Accepted: " + JSON.stringify(predictionTypes),
    });

  if (!competition || !competition.name)
    return res.status(422).send({
      message: "competition data incompleted or missing",
    });

  if (!date)
    return res.status(422).send({
      message: "date field is missing",
    });

  if (!time)
    return res.status(422).send({
      message: "time field is missing",
    });

  if (!status || !["failed", "win", "pending"].includes(status))
    return res.status(422).send({
      message: "status field values should be 'failed' | 'win'",
    });

  const event = new Event({
    _id: mongoose.Types.ObjectId(),
    fixtureId: fixtureId,
    home: {
      logo: home.logo,
      name: home.name,
    },
    away: {
      logo: away.logo,
      name: away.name,
    },
    cote: cote,
    chance: chance,
    prediction: {
      name: prediction.name,
      time: prediction.time,
    },
    competition: {
      logo: competition.logo,
      name: competition.name,
      country: competition.country,
    },
    date: date,
    status: status,
    eventType,
    createdAt: new Date().toISOString(),
    time,
  });
  event
    .save()
    .then((event) => {
      res.status(201).json({
        message: "Event created successfully",
        data: event,
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Update event
router.put("/events/:id", (req, res, next) => {
  const id = req.params.id;
  const eventType = req.body.eventType;
  const home = req.body.home;
  const away = req.body.away;
  const cote = req.body.cote;
  const chance = req.body.chance;
  const prediction = req.body.prediction;
  const competition = req.body.competition;
  const date = req.body.date;
  const status = req.body.status;
  const time = req.body.time;
  const score = req.body.score;

  if (!["normal", "combo", "coupon", "risk", "vip"].includes(eventType))
    return res.status(403).send({
      message:
        'Event type should be ["normal", "combo", "coupon", "risk", "vip"]',
    });

  if (!home || !home.name)
    return res.status(422).send({
      message: "Home team data incompleted",
    });

  if (!away || !away.name)
    return res.status(422).send({
      message: "Away team data incompleted or missing",
    });

  if (!cote || parseInt(cote) < 1)
    return res.status(422).send({
      message: "Cote data incompleted or missing",
    });

  if (!chance || parseInt(chance) < 0)
    return res.status(422).send({
      message: "chance data incompleted or missing",
    });

  if (!prediction || !prediction.name || !prediction.time || !predictionTypes.includes(prediction.name))
    return res.status(422).send({
      message: "prediction data incompleted or missing. Accepted: " + JSON.stringify(predictionTypes),
    });

  if (!competition || !competition.name)
    return res.status(422).send({
      message: "competition data incompleted or missing",
    });

  if (!date)
    return res.status(422).send({
      message: "date field is missing",
    });

  if (!status || !["failed", "win", "pending"].includes(status))
    return res.status(422).send({
      message: "status field values should be 'failed' | 'win'",
    });

  const event = {
    home: {
      logo: home.logo,
      name: home.name,
    },
    away: {
      logo: away.logo,
      name: away.name,
    },
    cote: cote,
    chance: chance,
    prediction: {
      name: prediction.name,
      time: prediction.time,
    },
    competition: {
      logo: competition.logo,
      name: competition.name,
      country: competition.country,
    },
    date: date,
    status: status,
    eventType,
    time,
    score,
  };

  Event.updateOne({ _id: id }, event)
    .exec()
    .then((event) => {
      return res.status(200).json({
        message: "Event updated successfully",
        data: event,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

// Delete an event
router.delete("/events/:id", (req, res, next) => {
  const id = req.params.id;
  Event.deleteOne({ _id: id })
    .exec()
    .then((events) => {
      return res.status(200).json({
        message: "Event deleted successfully",
        data: events,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

// Save users token for FCM notifications
router.post("/users/fcmtoken", async (req, res, next) => {
  const fcmtoken = req.body.fcmtoken;

  if (!fcmtoken)
    return res.status(400).send({
      message: "Token value is missing",
    });

  const tokenExist = await User.findOne({ fcmtoken });

  if (tokenExist) {
    return res.status(200).json({
      message: "User fcm token already exist",
    });
  }

  User.findOneAndUpdate(
    { fcmtoken: fcmtoken },
    { $set: { fcmtoken: fcmtoken } },
    { upsert: true, new: true }
  )
    .then((userToken) => {
      res.status(201).json({
        message: "User fcm token saved successfully",
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Send basic notification to all users
router.post("/users/notifications", async (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;

  if (!title)
    return res.status(400).send({
      message: "Title is missing",
    });

  if (!description)
    return res.status(400).send({
      message: "Description is missing",
    });

  // get users fcm tokens
  const registrationres = await User.find({});
  const registrationTokens = registrationres.map((item) => item.fcmtoken);
  if (registrationTokens.length === 0) {
    return res.status(200).send({
      message: "No users tokens",
    });
  }

  // tokens list must not contain more than 500 items
  const promises = [];
  const chunks = chunkArray(registrationTokens, 500);

  chunks.forEach((chunk) => {
    const message = {
      notification: {
        title: title,
        body: description,
      },
      data: {
        title: title,
        body: description,
      },
      tokens: chunk,
      // Required for background/quit data-only messages on iOS
      contentAvailable: true,
      // Required for background/quit data-only messages on Android
      priority: "high",
    };
    promises.push(admin.messaging().sendEachForMulticast(message));
  });

  await Promise.all(promises)
    .then((response) => {
      res.status(200).send({
        success: 1,
        data: response.map((result) => ({
          successCount:
            result.successCount + " messages were sent successfully",
          failureCount: result.failureCount + " messages failed",
        })),
      });
    })
    .catch((err) => {
      res.status(422).send({ success: 0, err });
    });
});

module.exports = router;
