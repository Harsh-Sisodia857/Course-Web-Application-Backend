const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique : true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher', 'coursecreator'], default : "student", required: true },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        // expiresIn: process.env.JWT_EXPIRE,
        expiresIn: "2d",
    });
};

// Compare Password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
