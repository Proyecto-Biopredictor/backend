const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Factor = require('../models/Factor');

const HttpError = require('../models/http-error');
const Bioprocess = require('../models/Bioprocess');

//Get a Factor by ID
const getFactorById = async (req, res, next) => {
  const FactorId = req.params.fid;

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
     bioprocess = await Bioprocess.findById(req.body.bioprocessID);
    
   } catch (err) {
     const error = new HttpError(
       'Could not fetch bioprocess, please try again.',
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

const getFactors = async (req, res, next) => {
  
  let factors;
  try {
    factors = await Factor.find().populate('factors');
  } catch (err) {
    const error = new HttpError(
      'Fetching factors failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    factors: factors.map(factor =>
      factor.toObject({ getters: true })
    )
  });
};


const deleteFactor = async (req, res, next) => {
  const factorId = req.params.fid;

  let factor;
  try {
    factor = await Factor.findById(factorId).populate('factor');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete factor.',
      500
    );
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await factor.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete factor.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted factor.' });
}

const updateFactor = async (req, res, next) => {

  const { name, description, isDependent, bioprocessID, type} = req.body;
  const factorId = req.params.fid;

  let factor;
  try {
    factor = await Factor.findById(factorId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update factor.',
      500
    );
    return next(error);
  }

  factor.name = name;
  factor.description = description;
  factor.isDependent = isDependent;
  factor.bioprocessID = bioprocessID;
  factor.type = type;

  try {
    await factor.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update factor.',
      500
    );
    return next(error);
  }

  res.status(200).json({ factor: factor.toObject({ getters: true }) });
};

const getFactorsFromBio = async (req, res, next) => {
  const bioprocessId = req.params.bid;
  let factors = [];
  try {
    factors = await Factor.find().populate('factors');
  } catch (err) {
    const error = new HttpError(
      'Fetching factors failed, please try again later.',
      500
    );
    return next(error);
  }
  let bioprocess =[];
  try {
    bioprocess = await Bioprocess.findById(bioprocessId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not fetch bioprocess.',
      500
    );
    return next(error);
  }
  var factorIdArray = [];
  let factorsFromBio = [];

  factors.forEach(arrayitem => {
    if(arrayitem.bioprocessID == bioprocessId){
      factorsFromBio.push(arrayitem);
    }
    
  });



  console.log(factorsFromBio);

  res.json({
    factors: factorsFromBio.map(factor =>
      factor.toObject({ getters: true })
    )
  });
};

exports.getFactorById = getFactorById;
exports.createFactor = createFactor;
exports.getFactors = getFactors;
exports.deleteFactor = deleteFactor;
exports.updateFactor = updateFactor;
exports.getFactorsFromBio = getFactorsFromBio;