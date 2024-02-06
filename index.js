const express = require("express");
const courseRoutes = require("./routes/courseRoutes");
const userRoutes = require("./routes/userRoutes");
const connectToDatabase = require("./db");
const cookieParser = require('cookie-parser')
const app = express();
const port = 4000;
const dotenv = require('dotenv')
connectToDatabase();
app.use(cookieParser())
dotenv.config({ path: "./.env" });


// middleware to parse json
app.use(express.json());
app.use('/course', courseRoutes);
app.use('/auth', userRoutes);


app.listen(port, () => {
    console.log('====================================');
    console.log(`Server is Listening at ${port}`);
    console.log('====================================');
})