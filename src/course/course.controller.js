'use strict'

import Course from './course.model.js'
import Student from '../student/student.model.js'
import { checkUpdate } from '../utils/validator.js'

//Crear curso
export const createCourse = async (req, res) => {
    try {
        const { name, description } = req.body
        const teacherId = req.teacher._id
        const course = new Course({
            name,
            description,
            teacher: teacherId
        });
        await course.save();
        return res.status(201).send({ message: 'Course created successfully' })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error creating course' })
    }
}

//Editar curso
export const editCourse = async (req, res) => {
    try {
        const { cid } = req.params;
        const course = await Course.findById(cid);
        if (course.teacher.toString() !== req.teacher._id.toString()) {
            return res.status(403).send({ message: 'You are not authorized to update this course' });
        }
        const updatedCourse = await Course.findByIdAndUpdate(cid, req.body, { new: true });
        return res.send({ message: 'Course updated successfully', course: updatedCourse });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error updating course' });
    }
}

export const deleteCourse = async (req, res) => {
    try {
        const { cid } = req.params;
        const course = await Course.findById(cid);
        if (course.teacher.toString() !== req.teacher._id.toString()) {
            return res.status(403).send({ message: 'You are not authorized to delete this course' })
        }
        await Course.findByIdAndDelete(cid)
        await Student.updateMany({ courses: deleteCourse._id }, { $pull: { courses: deleteCourse._id } })
        return res.send({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error deleting course' })
    }
}
