const express = require('express');
const router = express.Router();
const Weather = require('../models/weather.model.js');

router.get('/', list)
router.post('/create', create);
router.get('/temperature', temperature);

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
  if (req.query.lat && req.query.lon) {
    allWeatherByLatLon({lat: req.query.lat, lon: req.query.lon}, function(err, weatherData) {
        if (err) next(err);
        if (weatherData.length == 0) return res.status(404).send(weatherData);



        res.status(200).send(weatherData);
    });
  } else {
    allWeatherById(function(err, weatherData) {
        if (err) next(err);
        res.status(200).send(weatherData);
    });
  }

}

function create(req, res, next) {
  let weather = req.body;
  createWeather(weather, function(err, newWeatherData) {
    if (err) return res.status(400).send(err);
    res.status(201).send(newWeatherData);
  });
};

function temperature(req, res, next) {
  if (req.query.start_date && req.query.end_date) {
    allWeatherByCityState({start: req.query.start_date, end: req.query.end_date}, function(err, weatherData) {
        if (err) next(err);

        const results = [];
        for(var i = 0; i < weatherData.length; i++) {
          let data = weatherData[i];

          var dataViewModel = {}
          dataViewModel['lat'] = data.lat;
          dataViewModel['lon'] = data.lon;
          dataViewModel['city'] = data.city;
          dataViewModel['state'] = data.state;

          if (data.temperatures.length > 0 && data.temperatures[0].length > 0) {
            maxTemp = data.temperatures[0][0];
            minTemp = data.temperatures[0][0];
            for(var j = 0; j < data.temperatures.length; j++) {
              let nextMax = Math.max(...data.temperatures[j]);
              let nextMin = Math.min(...data.temperatures[j]);
              maxTemp = (maxTemp < nextMax) ? nextMax : maxTemp;
              minTemp = (minTemp > nextMin) ? nextMin : minTemp;
            }
            dataViewModel['lowest'] = minTemp;
            dataViewModel['highest'] = maxTemp;
          } else {
            dataViewModel['message'] = 'There is no weather data in the given range'
          }

          results.push(dataViewModel);
        }

        return res.status(200).send(results);
    });
  } else {
    return res.status(403).send(`Must include start and end date`);
  }

}

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
  Weather.find({}, callback).sort("id");
}

function allWeatherByLatLon(coordinates, callback) {
  const query = {};
  if (coordinates.lat) query["location.lat"] = coordinates.lat;
  if (coordinates.lon) query["location.lon"] = coordinates.lon;
  Weather.find(query, callback)
}

function allWeatherByCityState(range, callback) {
  Weather.aggregate(
    [{
      $group: {
        _id: "$location.city",
        state: {"$first":"$location.state"},
        lat: {"$first":"$location.lat"},
        lon: {"$first":"$location.lon"},
        temperatures: {"$push":"$temperature"},
      }
    },{
      $sort: {
          _id: 1, state: 1
      }
    }],
    callback)
}
