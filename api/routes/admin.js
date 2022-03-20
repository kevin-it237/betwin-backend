const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Event = require("../models/Event");

// Event creation
router.post("/events", (req, res, next) => {
  const eventType = req.body.eventType;
  const home = req.body.home;
  const away = req.body.away;
  const cote = req.body.cote;
  const chance = req.body.chance;
  const prediction = req.body.prediction;
  const competition = req.body.competition;
  const date = req.body.date;
  const status = req.body.status;

  if (!["normal", "combo"].includes(eventType))
    return res.status(403).send({
      message: "Event type should be 'normal' or 'combo'",
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

  if (!prediction || !prediction.name || !prediction.time)
    return res.status(422).send({
      message: "prediction data incompleted or missing",
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

  const event = new Event({
    _id: mongoose.Types.ObjectId(),
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
    },
    date: date,
    status: status,
    eventType,
    createdAt: new Date().toISOString(),
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
      console.log({ err });
      res.status(500).json(err);
    });
});

// Update event
router.put('/events/:id', (req, res, next) => {
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

  if (!["normal", "combo"].includes(eventType))
    return res.status(403).send({
      message: "Event type should be 'normal' or 'combo'",
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

  if (!prediction || !prediction.name || !prediction.time)
    return res.status(422).send({
      message: "prediction data incompleted or missing",
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
    },
    date: date,
    status: status,
    eventType,
  }

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
router.delete('/events/:id', (req, res, next) => {
  const id = req.params.id
  Event.deleteOne({ _id: id })
      .exec()
      .then(events => {
          return res.status(200).json({
              message: "Event deleted successfully",
              data: events
          })
      })
      .catch(err => {
        console.log(err)
          return res.status(500).json({ error: err })
      })
})

module.exports = router;
