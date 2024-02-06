const express = require('express');
const router = express.Router();
const { createCourse, updateCourse, getCourse, enrollStudent } = require('../controllers/courseController');
const { checkUserRole } = require("../middleware/checkUserRole")
const { isAuthenticatedUser } = require("../middleware/auth")

router.post('/create', isAuthenticatedUser, checkUserRole("coursecreator"), createCourse);

router.put('/update/:id', isAuthenticatedUser, checkUserRole("coursecreator"), updateCourse);

router.get('/getCourse/:id', isAuthenticatedUser, getCourse);

router.post('/enroll/:courseId', isAuthenticatedUser, checkUserRole("student"), enrollStudent);


module.exports = router;
