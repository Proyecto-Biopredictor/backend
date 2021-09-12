const HttpError = require('../models/http-error');
const User = require('../models/User');

const getUsers = async (req, res, next) => {
  
    let users;
    try {
      users = await User.find().populate('users');
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

const updateUser = async (req, res, next) => {

    const { username, email, type, roles } = req.body;
    const userId = req.params.uid;
  
    let user;
    try {
      user = await User.findById(userId);
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
  
    res.status(200).json({ user: user.toObject({ getters: true }) });
  };

exports.getUsers = getUsers;
exports.updateUser = updateUser;