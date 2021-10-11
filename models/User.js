const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
    },
    email:{
        type: String,
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Error: Email is not valid",
        ],
        
    },
    password: {
        type: String,
        minlength: 6,
        select: false,
    },
    type: { type: String },
    roles: [{ type: Object, required: true, ref: 'Role' }],
    phone: {type: String},
    name: {type: String},
    lastname: {type: String},
    details: {type: String},
    image: {type: String},
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

UserSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

UserSchema.methods.matchPasswords = async function(password){

    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.getSignedToken = function(){
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
}

UserSchema.methods.getResetPasswordToken = function(){
    const resetToken  = crypto.randomBytes(16).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

    return resetToken;
}

const User = mongoose.model("User", UserSchema);

module.exports = User;