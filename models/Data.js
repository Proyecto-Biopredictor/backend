const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DataSchema = new Schema({
  temporal: { type: String, required: true },
  values: { type: Array, required: true },
  placeID: { type: mongoose.Types.ObjectId, required: true, ref: 'Plalce' }
});

const Data = mongoose.model('Type', DataSchema);

module.exports = Data;