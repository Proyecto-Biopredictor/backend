const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Place = require('../models/Place');

const HttpError = require('../models/http-error');
const User = require('../models/User');

//Get a Place by ID
const getPlaceById = async (req, res, next) => {
  const PlaceId = req.params.bid;

  let Place;
  console.log(PlaceId);
  try {
    Place = await Place.findById(PlaceId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a Place.',
      500
    );
    return next(error);
  }

  if (!Place) {
    const error = new HttpError(
      'Could not find Place for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ Place: Place.toObject({ getters: true }) });
};

// Create a Place
const createPlace = async (req, res, next) => {

  const { name, description, isTimeSeries, image, type } = req.body;

  const createdPlace = new Place({
    name,
    description,
    latitude,
    longitude,
    image
  });

   let user;
   try {
     user = await User.findById(req.userData.userId);
    
   } catch (err) {
     const error = new HttpError(
       'Creating Place failed, please try again.',
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
    await createdPlace.save({ session: sess });
    // user.Placees.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError(
      'Creating Place failed, please try again.',
      500
    );
    console.log(err);
    return next(error);
  }

  res.status(201).json({ Place: createdPlace });
};

exports.getPlaceById = getPlaceById;
exports.createPlace = createPlace;