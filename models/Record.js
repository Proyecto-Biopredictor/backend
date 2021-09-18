const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RecordSchema = new Schema({
  timestamp: { type: String, required: true },
  bioprocessID: { type: mongoose.Types.ObjectId, required: true, ref: 'Bioprocess' },
  placeID: { type: mongoose.Types.ObjectId, required: true, ref: 'Place' },
  values: [{ type: Object, ref: 'Values'}],
});

const Record = mongoose.model('Record', RecordSchema);

module.exports = Record;