const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BioprocessSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  isTimeSeries: { type: Boolean, required: true },
  image: { type: String },
  type: { type: String, required: true },
  
});

const Bioprocess = mongoose.model('Bioprocess', BioprocessSchema);

module.exports = Bioprocess;