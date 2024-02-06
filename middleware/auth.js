const jwt = require("jsonwebtoken")
const User = require("../models/User")


exports.isAuthenticatedUser = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({message : "Please Login To Access This Resource"});
        }
        const decodeData = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Data : ",decodeData);

        // while creating jwt we gave id, here we access that id -----> jwt.sign({ id: this._id } ......
        req.user = await User.findById(decodeData.id)
        next();
    } catch (err) {
        console.log(err);
    }
}

