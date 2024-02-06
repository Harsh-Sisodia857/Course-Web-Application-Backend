const Course = require('../models/course');
const Teacher = require("../models/Teacher")
const Student = require("../models/Student");

module.exports.createCourse = async (req, res) => {
    try {
        const { name, subject, chapters, type, learnMode, teacherId } = req.body;

        if (!name || !subject || !chapters || !type || !learnMode || !teacherId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (req.user.role !== 'coursecreator') {
            return res.status(403).json({ error: 'Unauthorized. Only Course Creators can create courses.' });
        }

        const teacherExists = await Teacher.find({ _id: teacherId });
        if (!teacherExists) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        const newCourse = await Course.create({
            name,
            subject,
            chapters,
            type,
            learnMode,
            teacher: teacherId,
            student: []
        });

        await Teacher.findByIdAndUpdate(
            teacherId,
            {
                $push: {
                    taughtCourses: {
                        course: newCourse._id,
                    },
                },
            },
            { new: true }
        );

        res.status(201).json({ message: 'Course created successfully', courseId: newCourse._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports.updateCourse = async (req, res) => {
    try {
        const courseId = req.params.id;

        if (req.user.role !== 'coursecreator') {
            return res.status(403).json({ error: 'Unauthorized. Only Course Creators can update courses.' });
        }

        const { name, subject, chapters, type, learnMode, teacherId } = req.body;

        const updatedCourseDetails = {};
        if (name) updatedCourseDetails.name = name;
        if (subject) updatedCourseDetails.subject = subject;
        if (chapters) updatedCourseDetails.chapters = chapters;
        if (type) updatedCourseDetails.type = type;
        if (learnMode) updatedCourseDetails.learnMode = learnMode;
        if (teacherId) updatedCourseDetails.teacher = teacherId;

        const updatedCourse = await Course.findByIdAndUpdate(courseId, updatedCourseDetails, { new: true });

        if (!updatedCourse) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json({ message: 'Course updated successfully', updatedCourse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const filterTeacherView = (course) => {
    return {
        name: course.name,
        subject: course.subject,
        chapters: course.chapters,
        type: course.type,
        learnMode: course.learnMode,
        students: course.students.map(student => ({ _id: student._id, name: student.name })),
    };
};

const filterStudentView = (course) => {
    return {
        name: course.name,
        subject: course.subject,
        chapters: course.chapters,
        type: course.type,
        learnMode: course.learnMode,
        teacher: course.teacher.name
    };
};


module.exports.getCourse = async (req, res) => {
    try {
        const courseId = req.params.id;

        const courseWithStudents = await Course.findById(courseId).populate('teacher').populate('students');

        const courseWithoutStudents = await Course.findById(courseId).populate('teacher');

        if (!courseWithStudents || !courseWithoutStudents) {
            return res.status(404).json({ error: 'Course not found' });
        }

        switch (req.user.role) {
            case 'coursecreator':
                res.json({ message: 'Detailed course information for Course Creator', course: courseWithStudents });
                break;
            case 'teacher':
                res.json({
                    message: 'Basic course information for Teacher',
                    course: filterTeacherView(courseWithStudents)
                });
                break;
            case 'student':
                res.json({ message: 'Basic course information for Student', course: filterStudentView(courseWithoutStudents) });
                break;
            default:
                res.status(403).json({ error: 'Unauthorized' });
                break;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports.enrollStudent = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const userId = req.user._id;

        const student = await Student.findOne({ user: userId });

        if (!student) {
            return res.status(404).json({ error: 'You are Not Student' });
        }

        const studentId = student._id;

        const isEnrolled = await Course.exists({ _id: courseId, students: studentId });
        if (isEnrolled) {
            return res.status(400).json({ error: 'Student is already enrolled in the course' });
        }

        await Course.findByIdAndUpdate(courseId, { $push: { students: studentId } });

        await Student.findByIdAndUpdate(studentId, { $push: { enrolledCourses: courseId } });

        res.json({ message: 'Student enrolled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

