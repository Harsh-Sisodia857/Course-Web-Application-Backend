const CourseCreator = require("../models/CourseCreator");
const Teacher = require("../models/Teacher");
const User = require("../models/User");
const Student = require("../models/Student");
const sendToken = require("../utils/sendToken");

module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({
                error : "Please Fill All Details"
            })
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await user.comparePassword(password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        sendToken(user, 200, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!['teacher', 'student', 'coursecreator'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
        });


        if (role === 'student') {
            const studentDetails = {
                name, email, password, enrolledCourses : []
            };
            await Student.create({
                ...studentDetails,
                user: user._id
            });
        } else if (role === 'coursecreator') {
            const creatorDetails = {
                name, email, password, createdCourses: []
            };
            await CourseCreator.create({
                ...creatorDetails, user: user._id
            });
        } else {
            const teacherDetails = {
                name, email, password, taughtCourses: []
            }
            await Teacher.create({
                ...teacherDetails, user: user._id
            })
        }
        const token = user.getJWTToken();
        sendToken(user, 201, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}