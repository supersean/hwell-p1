const express = require('express');
const router = express.Router();
const Location = require('../models/location.model.js');

router.post('/create', function(req,res,next) {
  let location = new Location(
    {
      lat: req.body.lat,
      lon: req.body.lon,
      city: req.body.city,
      state: req.body.state
    }
  )
  location.save(function(err) {
    if (err) {
      return next(err);
    }
    res.status(201).send(location);
  })
});

module.exports = router;
