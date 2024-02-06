const mongoose = require("mongoose");

const connectToDatabase = () => {
    mongoose.connect("mongodb://0.0.0.0:27017/course", {
        useNewUrlParser: true,
        useUnifiedTopology : true
    }).then((data) => {
        console.log(`Mongodb connected with server`);
    }).catch((err) => {
        console.log(`Error : ${err}`);
    })
}

module.exports = connectToDatabase;