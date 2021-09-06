const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  //TODO IMAGE
  bioprocessID: { type: mongoose.Types.ObjectId, required: true, ref: 'Bioprocess' }
});

const Place = mongoose.model('Place', PlaceSchema);

module.exports = Place;