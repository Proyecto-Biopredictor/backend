const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PredictionSchema = new Schema({
  bioprocessID: { type: mongoose.Types.ObjectId, required: true, ref: 'Bioprocess' },
  placeID: { type: mongoose.Types.ObjectId, required: true, ref: 'Place' },
  initialDate: { type: String, required: true, ref: 'initialDate'  },
  finalDate: { type: String, required: true, ref: 'finalDate'  },
});

const Prediction = mongoose.model('Prediction', PredictionSchema);

module.exports = Prediction;