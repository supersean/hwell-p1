const express = require('express');
const router = express.Router();
const Weather = require('../models/weather.model.js');

router.get('/', list)
router.post('/create', create);

module.exports = router;

function list(req, res, next) {
  Weather.find({}, function(err, result) {
    if (err) next(err);
    return res.status(200).send(result);
  }).select("weather_id").sort("weather_id");
}

function create(req, res, next) {
  let weather = req.body;
  Weather.findOne({weather_id: weather.weather_id }, function(err, result) {
    if (err) next(err);
    if (result) {
      return res.status(400).send(`There already exists weather data with id: ${weather.weather_id}`);
    }

    let newWeather = new Weather(weather);
    newWeather.save(function (err) {
      if (err) {
        return next(err);
      }
      return res.status(201).send(weather);
    })
  });
};
