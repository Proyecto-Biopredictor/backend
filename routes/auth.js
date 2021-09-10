const express = require('express');
const router = express.Router();

const {register, login, forgotpassword, resetpassword } = require('../controllers/auth');

router.route("/register").put(register);

router.route("/login").put(login);

router.route("/forgotpassword").put(forgotpassword);

router.route("/resetpassword/:resetToken").put(resetpassword);

module.exports = router;