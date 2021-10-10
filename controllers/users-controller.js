const HttpError = require('../models/http-error');
const User = require('../models/User');

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
  
  let users;
  try {
    users = await User.find({}, {image: 0});

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

    const { username, email, type, roles } = req.body;
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
  
    user.title = username;
    user.body = email;
    user.type = type;
    user.roles = roles
  
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


exports.getUsers = getUsers;
exports.getAllUsers = getAllUsers;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;