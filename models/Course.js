const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subject: { type: String, required: true },
    chapters: { type: Number, required: true },
    type: { type: String, enum: ['Personalised', 'Group'], required: true },
    learnMode: { type: String, enum: ['Assisted', 'Self Learning'], required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;