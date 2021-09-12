const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Bioprocess = require('../models/Bioprocess');

const HttpError = require('../models/http-error');
const User = require('../models/User');

//Get a bioprocess by ID
const getBioprocessById = async (req, res, next) => {
  const bioprocessId = req.params.bid;

  let bioprocess;
  try {
    bioprocess = await Bioprocess.findById(bioprocessId);
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

const getBioprocesses = async (req, res, next) => {
  
  let bioprocesses;
  try {
    bioprocesses = await Bioprocess.find().populate('bioprocesses');
  } catch (err) {
    const error = new HttpError(
      'Fetching bioprocesses failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    bioprocesses: bioprocesses.map(user =>
      user.toObject({ getters: true })
    )
  });
};

const getFilteredBioprocesses = async (req, res, next) => {
  const userId = req.params.uid;
  let bioprocesses;
  try {
    bioprocesses = await Bioprocess.find().populate('bioprocesses');
  } catch (err) {
    const error = new HttpError(
      'Fetching bioprocesses failed, please try again later.',
      500
    );
    return next(error);
  }
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not fetch user.',
      500
    );
    return next(error);
  }
  var bioIdArray = [];
  bioprocesses.forEach(function (arrayitem){
    bioIdArray.push(arrayitem.id);
  });

  
  var roles = Object.values(user.roles);
  roles.forEach(function (arrayitem){
    if(bioIdArray.includes(arrayitem.bioprocessId)){ 
      bioprocesses.splice(bioIdArray.indexOf(arrayitem.bioprocessId),1);
      bioIdArray.splice(bioIdArray.indexOf(arrayitem.bioprocessId),1);
    }
  });
  
    

  res.json({
    bioprocesses: bioprocesses.map(user =>
      user.toObject({ getters: true })
    )
  });
};

exports.getBioprocessById = getBioprocessById;
exports.createBioprocess = createBioprocess;
exports.getBioprocesses = getBioprocesses;
exports.getFilteredBioprocesses = getFilteredBioprocesses;