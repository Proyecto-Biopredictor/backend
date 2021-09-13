const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Factor = require('../models/Factor');

const HttpError = require('../models/http-error');
const Bioprocess = require('../models/Bioprocess');

//Get a Factor by ID
const getFactorById = async (req, res, next) => {
  const FactorId = req.params.bid;

  let Factor;
  console.log(FactorId);
  try {
    Factor = await Factor.findById(FactorId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a Factor.',
      500
    );
    return next(error);
  }

  if (!Factor) {
    const error = new HttpError(
      'Could not find Factor for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ Factor: Factor.toObject({ getters: true }) });
};

// Create a Factor
const createFactor = async (req, res, next) => {

  const { name, description, isDependent, bioprocessID, type } = req.body;

  const createdFactor = new Factor({
    name,
    description,
    isDependent,
    bioprocessID,
    type
  });

   let bioprocess;
   try {
     bioprocess = await Bioprocess.findById(req.bioprocessData.bioprocessID);
    
   } catch (err) {
     const error = new HttpError(
       'Creating Factor failed, please try again.',
       500
     );
     return next(error);
   }

   if (!bioprocess) {
     const error = new HttpError('Could not find bioprocess for provided id.', 404);
     return next(error);
   }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdFactor.save({ session: sess });
    // bioprocess.Factores.push(createdFactor);
    await bioprocess.save({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError(
      'Creating Factor failed, please try again.',
      500
    );
    console.log(err);
    return next(error);
  }

  res.status(201).json({ Factor: createdFactor });
};

exports.getFactorById = getFactorById;
exports.createFactor = createFactor;