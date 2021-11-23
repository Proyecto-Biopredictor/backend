const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Place = require('../models/Place');
const Bioprocess = require('../models/Bioprocess');

const HttpError = require('../models/http-error');
const User = require('../models/User');
const Prediction = require('../models/Prediction');

const createPrediction = async (req, res, next) => {

    const { bioprocessID, placeID, initialDate, finalDate } = req.body;

    const createdPrediction = new Prediction({
        bioprocessID,
        placeID,
        initialDate,
        finalDate
    });


    let bioprocess;
    try {
        bioprocess = await Bioprocess.findById(bioprocessID);
    } catch (err) {
        const error = new HttpError(
            "Could not fetch bioprocess, please try again.",
            500
        );
        return next(error);
    }

    if (!bioprocess) {
        const error = new HttpError(
            "Could not find bioprocess for provided id.",
            404
        );
        return next(error);
    }

    let place;
    try {
        place = await Place.findById(placeID);
    } catch (err) {
        const error = new HttpError(
            "Could not fetch place, please try again.",
            500
        );
        return next(error);
    }

    if (!place) {
        const error = new HttpError("Could not find place for provided id.", 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPrediction.save({ session: sess });
        await user.save({ session: sess });
        await sess.commitTransaction();

    } catch (err) {
        const error = new HttpError(
            'Creating Prediction failed, please try again.',
            500
        );
        console.log(err);
        return next(error);
    }

    res.status(201).json({ Prediction: createdPrediction });

};

const getPredictions = async (req, res, next) => {
  
    let predictions;
    try {
      predictions = await Bioprocess.find({}, {image: 0});
      console.log(predictions);
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        'Fetching predictions failed, please try again later.',
        500
      );
      return next(error);
    }
  
    res.json({
        predictions: predictions.map(prediction =>
        prediction.toObject({ getters: true })
      )
    });
  };

exports.createPrediction = createPrediction;
exports.getPredictions = getPredictions;