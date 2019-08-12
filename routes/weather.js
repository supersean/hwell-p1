const express = require('express');
const router = express.Router();
const Weather = require('../models/weather.model.js');

router.get('/', list)
router.post('/create', create);

module.exports = router;

initWeatherData(require('../models/create_weather_data.js'));

function initWeatherData(data) {
  for(var i = 0; i < data.length; i++) {
    createWeather(data[i], function(err) {
      if (err) console.log(err);
    });
  }
}

function list(req, res, next) {
  allWeatherById(function(err, weatherData) {
      if (err) next(err);
      res.status(200).send(weatherData);
  });
}

function create(req, res, next) {
  let weather = req.body;
  createWeather(weather, function(err, newWeatherData) {
    if (err) return res.status(400).send(err);
    res.status(201).send(newWeatherData);
  });
};

function findWeather(weather, callback) {
    Weather.findOne({id: weather.id}, callback);
}

function createWeather(weather, callback) {
  findWeather(weather, function(err, queriedWeather) {
      if (err) return callback(`Something went wrong checking if weather data exists`);
      if (queriedWeather) return callback(`There already exists weather data with id: ${queriedWeather.id}`);

      new Weather(weather).save(callback);
  });
}

function allWeatherById(callback) {
  Weather.find({}, callback).select("id").sort("id");
}
