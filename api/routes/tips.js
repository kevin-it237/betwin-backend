const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares/index")
const Event = require("../models/Event");

// Get today tips
router.get("/today", authJwt.verifyToken, (req, res, next) => {
  const date = req.query.date;
  if(!date) return res.status(403).json({
    message: "Date is missing on query paramettrs",
  });

  Event.find({ eventType: "normal", date })
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
  if(!date) return res.status(403).json({
    message: "Date is missing on query parameters",
  });

  Event.find({ eventType: "combo", date })
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

// Get history tips
router.get("/history", authJwt.verifyToken, (req, res, next) => {
  const date = req.query.date;
  if(!date) return res.status(403).json({
    message: "Date is missing on query parameters",
  });

  Event.find({ date: { $ne: date } })
    .sort( { date: -1 } )
    .limit(10)
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

module.exports = router;
