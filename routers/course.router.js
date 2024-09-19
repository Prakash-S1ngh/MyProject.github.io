const express = require('express');
const { createCourse, getAllCourses, getAllCoursesbyId, updateCourse, deleteCourse } = require('../controllers/Course.controllers');
const { authorization } = require('../middleware/auth.middleware');
const upload = require('../middleware/fileuploading.middleware');
const router = express.Router();


router.post('/createCourse' ,upload.single('images') , authorization , createCourse);
router.route('/getAllCourses').get(getAllCourses);
router.get('/course/:courseId', getAllCoursesbyId);
router.post('/updatecourse' , upload.single('images') , authorization , updateCourse);
router.route('/deleteCourse').patch(deleteCourse);
module.exports = router;
