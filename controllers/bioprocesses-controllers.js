const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Bioprocess = require('../models/Bioprocess');
const User = require('../models/User');

//Get a bioprocess by Id
const getBioprocessById = async (req, res, next) => {
  const bioprocessId = req.params.nid;

  let bioprocess;
  console.log(bioprocessId);
  try {
    bioprocess = await Bioprocess.findById(bioprocessId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a note.',
      500
    );
    return next(error);
  }

  if (!bioprocess) {
    const error = new HttpError(
      'Could not find note for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ bioprocess: bioprocess.toObject({ getters: true }) });
};

//Get every bioprocess
const getAllBioprocesses = async (req, res, next) => {
  const userId = req.userData.userId;
  
  let bioprocesses;
  try {
    userWithNotes = await User.findById(userId).populate('notes');
    console.log("AAAA", userWithNotes);
  } catch (err) {
    const error = new HttpError(
      'Fetching notes failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!userWithNotes || userWithNotes.notes.length === 0) {
    return next(
      new HttpError('Could not find notes for the provided user id.', 404)
    );
  }

  res.json({
    notes: userWithNotes.notes.map(note =>
      note.toObject({ getters: true })
    )
  });
};

// Create a Note
const createBioprocess = async (req, res, next) => {

  const { title, body } = req.body;

  const createdNote = new Note({
    title,
    body,
    creator: req.userData.userId
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
    
  } catch (err) {
    const error = new HttpError(
      'Creating note failed, please try again.',
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
    await createdNote.save({ session: sess });
    user.notes.push(createdNote);
    await user.save({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError(
      'Creating note failed, please try again.',
      500
    );
    console.log(err);
    return next(error);
  }

  res.status(201).json({ note: createdNote });
};


exports.getBioprocessById = getBioprocessById;
exports.getAllBioprocesses = getAllBioprocesses;
exports.createBioprocess = createBioprocess;
