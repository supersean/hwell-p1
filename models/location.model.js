const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let LocationSchema = new Schema({
  lat: {type: Number, required: true },
  lon: {type: Number, required: true },
  city: {type: String, required: true },
  state: {type: String, required: true }
});

module.exports = mongoose.model('Location', LocationSchema);
