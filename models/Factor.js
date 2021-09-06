const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FactorSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  isDependent: { type: Boolean, required: true},
  bioprocessID: { type: mongoose.Types.ObjectId, required: true, ref: 'Bioprocess' },
  typeID: { type: mongoose.Types.ObjectId, required: true, ref: 'Type' }
});

const Factor = mongoose.model('Factor', FactorSchema);

module.exports = Factor;