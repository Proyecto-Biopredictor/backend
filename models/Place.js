const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  image: { type: String},
  
});

const Place = mongoose.model('Place', PlaceSchema);

module.exports = Place;