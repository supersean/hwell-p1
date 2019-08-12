const express = require('express');
const router = express.Router();
const Weather = require('../models/weather.model.js');

router.delete('/', deleteWeather);

module.exports = router;

function deleteWeather(req, res, next) {
  if (req.query.start && req.query.end) {
    deleteWeatherInRange({start: req.query.start, end: req.query.end}, function(err, id) {
      if (err) next(err);

      res.status(200).send(id);
    });
  } else {
    deleteAllWeather(function(err) {
      if (err) next (err);

      res.status(200).send("ALL WEATHER DELETED");
    })
  }
};

function deleteWeatherInRange(range, callback) {
  Weather.find({ $and: [
    {date: {$gte: new Date(range.start)}},
    {date: {$lte: new Date(range.end)}}
  ]}, function(err) {if (err) callback(err)})
  .remove(callback);
}

function deleteAllWeather(callback) {
  Weather.find({}, function(err) {if (err) callback(err)}).remove(callback);
}
