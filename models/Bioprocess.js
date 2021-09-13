const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BioprocessSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  isTimeSeries: { type: Boolean, required: true },
  image: { type: String },
  type: { type: String, required: true },
  places: [{ type: Object, ref: 'Place'}],
  factors: [{ type: Object, ref: 'Factor'}]
  
});

const Bioprocess = mongoose.model('Bioprocess', BioprocessSchema);

module.exports = Bioprocess;