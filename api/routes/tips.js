const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares/index");
const Event = require("../models/Event");
const { redisClientInit } = require("../../config/redis");

const REDIS_EXPIRATION = 180; // 3minutes

// Get today tips
router.get("/today", authJwt.verifyToken, async (req, res, next) => {
  const date = req.query.date;
  const skipCache = req.query.skipCache;
  if (!date)
    return res.status(403).json({
      message: "Date is missing on query paramettrs",
    });

  const client = await redisClientInit();
  const data = await client.get(req.originalUrl);
  if (data !== null && !skipCache) {
    return res.status(200).json(JSON.parse(data));
  }

  Event.find({ eventType: "normal", date })
    .exec()
    .then((todayTips) => {
      if (todayTips.length === 0) {
        return res.status(404).json({
          message: "Today tips not Found",
        });
      }

      const response = {
        message: "Today tips fetched successfully",
        data: todayTips,
      };

      // Store the fetched data in Redis with a 3-minute expiry
      client.set(req.originalUrl, JSON.stringify(response), "EX", REDIS_EXPIRATION);

      return res.status(200).json(response);
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

// Get combo tips
router.get("/combo", authJwt.verifyToken, async (req, res, next) => {
  const date = req.query.date;
  const skipCache = req.query.skipCache;
  if (!date)
    return res.status(403).json({
      message: "Date is missing on query parameters",
    });

  const client = await redisClientInit();
  const data = await client.get(req.originalUrl);
  if (data !== null && skipCache) {
    return res.status(200).json(JSON.parse(data));
  }

  Event.find({ eventType: "combo", date })
    .exec()
    .then((comboTips) => {
      if (comboTips.length === 0) {
        return res.status(404).json({
          message: "Combo tips not Found",
        });
      }

      const response = {
        message: "Combo tips fetched successfully",
        data: comboTips,
      };

      // Store the fetched data in Redis with a 3-minute expiry
      client.set(req.originalUrl, JSON.stringify(response), "EX", REDIS_EXPIRATION);

      return res.status(200).json(response);
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

// Get risk tips
router.get("/risk", authJwt.verifyToken, async (req, res, next) => {
  const date = req.query.date;
  const skipCache = req.query.skipCache;
  if (!date)
    return res.status(403).json({
      message: "Date is missing on query parameters",
    });

  const client = await redisClientInit();
  const data = await client.get(req.originalUrl);
  if (data !== null && skipCache) {
    return res.status(200).json(JSON.parse(data));
  }

  Event.find({ eventType: "risk", date })
    .exec()
    .then((riskTips) => {
      if (riskTips.length === 0) {
        return res.status(404).json({
          message: "Risk tips not Found",
        });
      }

      const response = {
        message: "Risk tips fetched successfully",
        data: riskTips,
      };

      // Store the fetched data in Redis with a 3-minute expiry
      client.set(req.originalUrl, JSON.stringify(response), "EX", REDIS_EXPIRATION);

      return res.status(200).json(response);
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

// Get vip tips
router.get("/vip", authJwt.verifyToken, async (req, res, next) => {
  const date = req.query.date;
  const skipCache = req.query.skipCache;
  if (!date)
    return res.status(403).json({
      message: "Date is missing on query parameters",
    });

  const client = await redisClientInit();
  const data = await client.get(req.originalUrl);
  if (data !== null && skipCache) {
    return res.status(200).json(JSON.parse(data));
  }

  Event.find({ eventType: "vip", date })
    .exec()
    .then((vipTips) => {
      if (vipTips.length === 0) {
        return res.status(404).json({
          message: "VIP tips not Found",
        });
      }

      const response = {
        message: "VIP tips fetched successfully",
        data: vipTips,
      };

      // Store the fetched data in Redis with a 3-minute expiry
      client.set(req.originalUrl, JSON.stringify(response), "EX", REDIS_EXPIRATION);

      return res.status(200).json(response);
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
