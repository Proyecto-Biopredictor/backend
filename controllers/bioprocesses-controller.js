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

  const { name, description, isTimeSeries, image, type, places, factors} = req.body;

  const createdBioprocess = new Bioprocess({
    name,
    description,
    isTimeSeries,
    image,
    type,
    places,
    factors
  });

   let user;
   try {
     user = await User.findById(req.userData.userId, {image: 0});
    
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
  createdBioprocess.image = "";
  res.status(201).json({ bioprocess: createdBioprocess });
};

const getBioprocesses = async (req, res, next) => {
  
  let bioprocesses;
  try {
    bioprocesses = await Bioprocess.find({}, {image: 0});
    console.log(bioprocesses);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Fetching bioprocesses failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    bioprocesses: bioprocesses.map(bioprocess =>
      bioprocess.toObject({ getters: true })
    )
  });
};

const getFilteredBioprocesses = async (req, res, next) => {
  const userId = req.params.uid;
  let bioprocesses;
  try {
    bioprocesses = await Bioprocess.find({}, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Fetching bioprocesses failed, please try again later.',
      500
    );
    return next(error);
  }
  let user;
  try {
    user = await User.findById(userId, {image: 0});
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
  
  console.log(user);
  if(user && bioprocesses && user.roles.length > 0){
    var roles = Object.values(user.roles);
    roles.forEach(function (arrayitem){
      if(bioIdArray.includes(arrayitem.bioprocessId)){ 
        bioprocesses.splice(bioIdArray.indexOf(arrayitem.bioprocessId),1);
        bioIdArray.splice(bioIdArray.indexOf(arrayitem.bioprocessId),1);
      }
    });
  }

  
    

  res.json({
    bioprocesses: bioprocesses.map(user =>
      user.toObject({ getters: true })
    )
  });
};

const deleteBioprocess = async (req, res, next) => {
  const bioprocessId = req.params.bid;

  let bioprocess;
  try {
    bioprocess = await Bioprocess.findById(bioprocessId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find bioprocess.',
      500
    );
    return next(error);
  }
  if (bioprocess.factors.length > 0){
    const error = new HttpError(
      'El bioproceso contiene datos. No se puede eliminar.',
      500
    );
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await bioprocess.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete bioprocess.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted bioprocess.' });
}

const updateBioprocess = async (req, res, next) => {

  const { name, description, isTimeSeries, image, type, places, factors} = req.body;
  const bioprocessId = req.params.bid;

  let bioprocess;
  try {
    bioprocess = await Bioprocess.findById(bioprocessId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update bioprocess.',
      500
    );
    return next(error);
  }

  bioprocess.name = name;
  bioprocess.description = description;
  bioprocess.isTimeSeries = isTimeSeries;
  bioprocess.image = image;
  bioprocess.type = type;
  bioprocess.places = places;
  bioprocess.factors = factors;

  try {
    await bioprocess.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update bioprocess.',
      500
    );
    return next(error);
  }
  bioprocess.image = "";
  res.status(200).json({ bioprocess: bioprocess.toObject({ getters: true }) });
};

exports.getBioprocessById = getBioprocessById;
exports.createBioprocess = createBioprocess;
exports.getBioprocesses = getBioprocesses;
exports.getFilteredBioprocesses = getFilteredBioprocesses;
exports.deleteBioprocess = deleteBioprocess;
exports.updateBioprocess = updateBioprocess;