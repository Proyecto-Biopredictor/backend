const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  image: { type: String},
  bioprocesses: [{ type: Object, ref: 'Bioprocess'}]
  
});

const Place = mongoose.model('Place', PlaceSchema);

module.exports = Place;