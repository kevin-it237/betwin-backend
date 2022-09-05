const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares/index");
const Coupon = require("../models/Coupon");
const Event = require("../models/Event");
const mongoose = require("mongoose");

// Get coupons by dates
router.get("/", authJwt.verifyToken, (req, res, next) => {
  const date = req.query.date;
  const isLive = req.query.isLive;
  if (!date)
    return res.status(403).json({
      message: "Date is missing on query paramettrs",
    });
  
  let condition = { date };
  if(isLive) condition = { ...condition, isLive };

  Coupon.find(condition)
    .exec()
    .then((coupons) => {
      if (coupons.length === 0) {
        return res.status(404).json({
          message: "Coupons not Found",
        });
      }

      return res.status(200).json({
        message: "Coupons fetched successfully",
        data: coupons,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

// Get coupon's events (get all events inside a coupon)
router.get("/:id", authJwt.verifyToken, async (req, res, next) => {
  const id = req.params.id;
  if (!id)
    return res.status(403).json({
      message: "couponId is missing on query paramettrs",
    });

  try {
    const coupon = await Coupon.findOne({ _id: id });
    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not Found",
      });
    }

    let couponEvents = [];
    if (coupon.events.length) {
      couponEvents = await Event.find({
        _id: {
          $in: coupon.events,
        },
      });
    }

    return res.status(200).json({
      message: "Coupon fetched successfully",
      data: {
        _id: coupon._id,
        isLive: coupon.isLive,
        date: coupon.date,
        createdAt: coupon.createdAt,
        events: couponEvents
      },
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

// Coupon creation
router.post("/", (req, res, next) => {
  const date = req.body.date;

  if (!date)
    return res.status(422).send({
      message: "date field is missing",
    });

  const coupon = new Coupon({
    _id: mongoose.Types.ObjectId(),
    events: [],
    date: date,
    createdAt: new Date().toISOString(),
  });
  coupon
    .save()
    .then((event) => {
      res.status(201).json({
        message: "Coupon created successfully",
        data: coupon,
      });
    })
    .catch((err) => {
      console.log({ err });
      res.status(500).json(err);
    });
});

// update creation
router.put("/:id", (req, res, next) => {
  const id = req.params.id;
  const date = req.body.date;
  const isLive = req.body.isLive;
  const events = req.body.events || [];

  if (!id)
    return res.status(403).send({
      message: "bad request",
    });

  // update coupon
  let coupon = {
    isLive,
    events,
  };
  if(date) coupon = { ...coupon, date };

  Coupon.updateOne({ _id: id }, { $set: coupon })
    .exec()
    .then((coupon) => {
      return res.status(200).json({
        message: "Coupon updated successfully",
        data: coupon,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

module.exports = router;
