const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Place = require('../models/Place');
const Bioprocess = require('../models/Bioprocess');

const HttpError = require('../models/http-error');
const User = require('../models/User');

//Get a Place by ID
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  console.log(placeId);
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a Place.',
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      'Could not find Place for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacePicture = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  console.log(placeId);
  try {
    place = await Place.findById(placeId, {image: 1, _id: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a Place.',
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      'Could not find Place for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

// Create a Place
const createPlace = async (req, res, next) => {

  const { name, description, latitude, longitude, image, bioprocesses } = req.body;

  const createdPlace = new Place({
    name,
    description,
    latitude,
    longitude,
    image,
    bioprocesses
  });

   let user;
   try {
     user = await User.findById(req.userData.userId, {image: 0});
    
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
  createdPlace.image = "";
  res.status(201).json({ Place: createdPlace });
};

const getPlaces = async (req, res, next) => {
  
  let places;
  try {
    places = await Place.find({}, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    places: places.map(places =>
      places.toObject({ getters: true })
    )
  });
};

const getFilteredPlaces = async (req, res, next) => {
  const bioprocessId = req.params.bid;
  let places;
  try {
    places = await Place.find({}, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed, please try again later.',
      500
    );
    return next(error);
  }
  let bioprocess;
  try {
    bioprocess = await Bioprocess.findById(bioprocessId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not fetch bioprocess.',
      500
    );
    return next(error);
  }
  var placeIdArray = [];
  places.forEach(function (arrayitem){
    placeIdArray.push(arrayitem.id);
  });

  if(bioprocess && places){
    bioprocess.places.forEach(function (arrayitem){
      if(placeIdArray.includes(arrayitem)){ 
        console.log("lo encontr??");
        places.splice(placeIdArray.indexOf(arrayitem),1);
        placeIdArray.splice(placeIdArray.indexOf(arrayitem),1);
      }
    });
  }

  res.json({
    places: places.map(place =>
      place.toObject({ getters: true })
    )
  });
};

const getPlacesFromBio = async (req, res, next) => {
  const bioprocessId = req.params.bid;
  let places = [];
  try {
    places = await Place.find({}, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed, please try again later.',
      500
    );
    return next(error);
  }
  let bioprocess =[];
  try {
    bioprocess = await Bioprocess.findById(bioprocessId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not fetch bioprocess.',
      500
    );
    return next(error);
  }
  var placeIdArray = [];
  places.forEach(function (arrayitem){
    placeIdArray.push(arrayitem.id);
  });

  console.log(bioprocess);
  let placesFromBio = [];
  if(bioprocess && places){
    bioprocess.places.forEach(function (arrayitem){
      if(placeIdArray.includes(arrayitem)){ 
        console.log("lo encontr??");
        placesFromBio.push(places[placeIdArray.indexOf(arrayitem)]);
      }
    });
  }

    
  console.log(placesFromBio);

  res.json({
    places: placesFromBio.map(place =>
      place.toObject({ getters: true })
    )
  });
};

const updatePlace = async (req, res, next) => {

  const { name, description, latitude, longitude, image, bioprocesses} = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  place.name = name;
  place.description = description;
  place.latitude = latitude;
  place.longitude = longitude;
  place.image = image;
  place.bioprocesses = bioprocesses;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }
  place.image = "";
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find place.',
      500
    );
    return next(error);
  }
  console.log(place);
  if (place.bioprocesses.length > 0){
    const error = new HttpError(
      'El lugar contiene bioprocesos. No se puede eliminar.',
      500
    );
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted place.' });
}

exports.getPlaceById = getPlaceById;
exports.createPlace = createPlace;
exports.getPlaces = getPlaces;
exports.getFilteredPlaces = getFilteredPlaces;
exports.getPlacesFromBio = getPlacesFromBio;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
exports.getPlacePicture = getPlacePicture;