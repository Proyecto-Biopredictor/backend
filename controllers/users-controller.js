const HttpError = require('../models/http-error');
const User = require('../models/User');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;

const getUserById = async (req, res, next) => {
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a user.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      'Could not find user for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ user: user.toObject({ getters: true }) });
};

const getUsers = async (req, res, next) => {
  
    let users;
    try {
      users = await User.find({}, {image: 0});
      users = users.filter(user => user.type === 'user');

    } catch (err) {
      const error = new HttpError(
        'Fetching users failed, please try again later.',
        500
      );
      return next(error);
    }
  
    res.json({
      users: users.map(user =>
        user.toObject({ getters: true })
      )
    });
};

const getAllUsers = async (req, res, next) => {
  const userId = req.params.uid;
  let users;
  try {
    users = await User.find({}, {image: 0});
    users = users.filter(user => user.id !== userId);
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    users: users.map(user =>
      user.toObject({ getters: true })
    )
  });
};

const updateUser = async (req, res, next) => {

    const { username, email, type, roles, phone, name, lastname, image, details } = req.body;
    const userId = req.params.uid;
  
    let user;
    try {
      user = await User.findById(userId, {image: 0});
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not update user.',
        500
      );
      return next(error);
    }
  
    user.username = username;
    user.email = email;
    user.type = type;
    user.roles = roles;
    user.phone = phone;
    user.name = name;
    user.lastname = lastname;
    user.image = image;
    user.details = details;
  
    try {
      await user.save();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not update user.',
        500
      );
      return next(error);
    }
    user.image="";
    res.status(200).json({ user: user.toObject({ getters: true }) });
};

const deleteUser = async (req, res, next) => {
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find user.',
      500
    );
    return next(error);
  }
  if (user.roles.length > 0){
    const error = new HttpError(
      'El usuario tiene roles. No se puede eliminar.',
      500
    );
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    
    await user.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete user.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted user.' });
}

const updateRole = async (req, res, next) => {

  const { roles } = req.body;
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update user.',
      500
    );
    return next(error);
  }
  user.roles = roles;
  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update user.',
      500
    );
    return next(error);
  }
  user.image="";
  res.status(200).json({ user: user.toObject({ getters: true }) });
};

const getPermissionsFromBio = async (req, res, next) => {

  const bioprocessId = req.params.bid; 
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update user.',
      500
    );
    return next(error);
  }
  const roles = user.roles;
  let permissions = {
    editFactor: true,
    editData: true,
    export: true
  };
  console.log(roles, "ROLES");
  for (const role in roles) {
    console.log(roles[role], "bid");
    if(roles[role].bioprocessId === bioprocessId){
      permissions = roles[role];
      break;
    }

  }
  res.status(200).json({ role: permissions });

};


exports.getUsers = getUsers;
exports.getAllUsers = getAllUsers;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getUserById = getUserById;
exports.updateRole = updateRole;
exports.getPermissionsFromBio = getPermissionsFromBio;