const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    taughtCourses: [
        {
            course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
            enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
        },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
