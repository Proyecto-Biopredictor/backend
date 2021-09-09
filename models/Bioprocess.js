const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BioprocessSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  isTimeSeries: { type: Boolean, required: true},
  //TODO IMAGE
  predictionID: { type: mongoose.Types.ObjectId, required: false, ref: 'Prediction' } //TODO HACER REQUIRED
});

const Bioprocess = mongoose.model('Bioprocess', BioprocessSchema);

module.exports = Bioprocess;