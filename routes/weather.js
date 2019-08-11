const express = require('express');
const router = express.Router();
const Weather = require('../models/weather.model.js');

router.post('/create', createWeather);

module.exports = router;


function createWeather(req, res, next) {
  let weather = req.body;
  console.log(weather.weather_id);
  Weather.findOne({weather_id: weather.weather_id }, function(err, result) {
    console.log(err);
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
