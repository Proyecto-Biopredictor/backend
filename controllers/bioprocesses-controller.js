const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Bioprocess = require('../models/Bioprocess');

const HttpError = require('../models/http-error');
const User = require('../models/User');

//Get a bioprocess by ID
const getBioprocessById = async (req, res, next) => {
  const bioprocessId = req.params.bid;

  let bioprocess;
  console.log(bioprocessId);
  try {
    bioprocess = await bioprocess.findById(bioprocessId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a bioprocess.',
      500
    );
    return next(error);
  }

  if (!bioprocess) {
    const error = new HttpError(
      'Could not find bioprocess for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ bioprocess: bioprocess.toObject({ getters: true }) });
};

// Create a bioprocess
const createBioprocess = async (req, res, next) => {

  const { name, description, isTimeSeries, image, type } = req.body;

  const createdBioprocess = new Bioprocess({
    name,
    description,
    isTimeSeries,
    image,
    type
  });

   let user;
   try {
     user = await User.findById(req.userData.userId);
    
   } catch (err) {
     const error = new HttpError(
       'Creating bioprocess failed, please try again.',
       500
     );
     return next(error);
   }

   if (!user) {
     const error = new HttpError('Could not find user for provided id.', 404);
     return next(error);
   }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdBioprocess.save({ session: sess });
    // user.bioprocesses.push(createdBioprocess);
    await user.save({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError(
      'Creating bioprocess failed, please try again.',
      500
    );
    console.log(err);
    return next(error);
  }

  res.status(201).json({ bioprocess: createdBioprocess });
};

exports.getBioprocessById = getBioprocessById;
exports.createBioprocess = createBioprocess;