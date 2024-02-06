const mongoose = require('mongoose');

const courseCreatorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const CourseCreator = mongoose.model('CourseCreator', courseCreatorSchema);

module.exports = CourseCreator;