const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let WeatherSchema = new Schema({
  id: {type: Number, required: true },
  date: {type: Date, required: true },
  temperature: {type: Array, required: true },
  location: {
    lat: {type: Number },
    lon: {type: Number },
    city: {type: String },
    state: {type: String }
  }
});

module.exports = mongoose.model('Weather', WeatherSchema);
