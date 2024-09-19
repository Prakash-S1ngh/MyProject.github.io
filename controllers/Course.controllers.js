const { uploadOnCloudinary } = require("../config/cloudinary.config");
const Course = require("../models/Course.models");

exports.createCourse = async (req, res) => {
    try {
        const { title, description, tags, price } = req.body;
        const image = req.file;
        const user = req.user._id;

        if (!title || !description || !tags || !price || !image || !user) {
            return res.status(400).json({
                success: false,
                message: "An error occurred: missing required fields"
            });
        }

        // Upload image to Cloudinary
        const url = await uploadOnCloudinary(image.path);
      

        if (!url) {
            return res.status(500).json({
                success: false,
                message: "An error occurred while uploading the image"
            });
        }
        console.log("Course cover image uploaded:", url);

        // Create a new course in the database
        const newCourse = await Course.create({
            title: title,
            description: description,
            courseImage: url.url,
            price: price,
            tag: tags,
            createdBy: user
        });

        if (!newCourse) {
            return res.status(400).json({
                success: false,
                message: "The course could not be created"
            });
        }

        return res.status(200).json({
            success: true,
            message: "The course was created successfully",
            newCourse
        });

    } catch (error) {
        console.error("Error while creating course:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred",
            error
        });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        if (!courses) {
            return res.status(400).json({
                success: false,
                message: "An error occurred in fetching courses"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            courses
        });
    } catch (error) {
        console.error("Error in fetching courses:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred in showing all courses",
            error
        });
    }
};

exports.getAllCoursesbyId = async (req, res) => {
    try {
        const { courseId } = req.params;
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required"
            });
        }
        const findCourse = await Course.findById(courseId);
        if (!findCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            findCourse
        });
    } catch (error) {
        console.error("Error in fetching course by ID:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the course",
            error
        });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, tags, price } = req.body;
        const image = req.file;

        let updatedata = { title, description, tags, price };

        // If a new image is provided, upload it to Cloudinary
        if (image) {
            const url = await uploadOnCloudinary(image.path);
            if (!url) {
                return res.status(500).json({
                    success: false,
                    message: "An error occurred while uploading the image"
                });
            }
            updatedata.courseImage = url;
        }

        // Update course data
        const updatedCourse = await Course.findByIdAndUpdate(courseId, updatedata, { new: true });

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: "Cannot find the course to update"
            });
        }
        return res.status(200).json({
            success: true,
            message: "The course was updated successfully",
            updatedCourse
        });

    } catch (error) {
        console.error("Error while updating course:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the course",
            error
        });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required to delete the course"
            });
        }
        const del = await Course.findByIdAndDelete(courseId);
        if (!del) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "The course was deleted successfully"
        });

    } catch (error) {
        console.error("Error while deleting course:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the course",
            error
        });
    }
};
