// @deprecated
const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares/index");
const Event = require("../models/Event");

// Get today tips
router.get("/today", authJwt.verifyToken, (req, res, next) => {
  const date = req.query.date;
  if (!date)
    return res.status(403).json({
      message: "Date is missing on query paramettrs",
    });

  Event.find({ eventType: "normal", date })
    .sort({ time: 1 })
    .exec()
    .then((todayTips) => {
      if (todayTips.length === 0) {
        return res.status(404).json({
          message: "Today tips not Found",
        });
      }
      return res.status(200).json({
        message: "Today tips fetched successfully",
        data: todayTips,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

// Get combo tips
router.get("/combo", authJwt.verifyToken, (req, res, next) => {
  const date = req.query.date;
  if (!date)
    return res.status(403).json({
      message: "Date is missing on query parameters",
    });

  Event.find({ eventType: "combo", date })
  .sort({ time: 1 })
    .exec()
    .then((comboTips) => {
      if (comboTips.length === 0) {
        return res.status(404).json({
          message: "Combo tips not Found",
        });
      }
      return res.status(200).json({
        message: "Combo tips fetched successfully",
        data: comboTips,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});


// Get combo tips
router.get("/risk", authJwt.verifyToken, (req, res, next) => {
  const date = req.query.date;
  if (!date)
    return res.status(403).json({
      message: "Date is missing on query parameters",
    });

  Event.find({ eventType: "risk", date })
  .sort({ time: 1 })
    .exec()
    .then((riskTips) => {
      if (riskTips.length === 0) {
        return res.status(404).json({
          message: "Risk tips not Found",
        });
      }
      return res.status(200).json({
        message: "Risk tips fetched successfully",
        data: riskTips,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});


// Get vip tips
router.get("/vip", authJwt.verifyToken, (req, res, next) => {
  const date = req.query.date;
  if (!date)
    return res.status(403).json({
      message: "Date is missing on query parameters",
    });

  Event.find({ eventType: "vip", date })
  .sort({ time: 1 })
    .exec()
    .then((vipTips) => {
      if (vipTips.length === 0) {
        return res.status(404).json({
          message: "VIP tips not Found",
        });
      }
      return res.status(200).json({
        message: "VIP tips fetched successfully",
        data: vipTips,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

// Get coupons tips
router.get("/coupon", authJwt.verifyToken, (req, res, next) => {
  const date = req.query.date;
  if (!date)
    return res.status(403).json({
      message: "Date is missing on query paramettrs",
    });

  Event.find({ eventType: "coupon", date })
    .exec()
    .then((todayCoupons) => {
      if (todayCoupons.length === 0) {
        return res.status(404).json({
          message: "Today coupons tips not Found",
        });
      }
      return res.status(200).json({
        message: "Today coupons fetched successfully",
        data: todayCoupons,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

// Get history tips
router.get("/history", authJwt.verifyToken, (req, res, next) => {
  const date = req.query.date;
  if (!date)
    return res.status(403).json({
      message: "Date is missing on query parameters",
    });

  Event.find({ date: { $ne: date }, status: { $ne: "pending" } })
    .sort({ date: -1 })
    .limit(10)
    .exec()
    .then((events) => {
      if (events.length === 0) {
        return res.status(404).json({
          message: "Past events not Found",
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

module.exports = router;
