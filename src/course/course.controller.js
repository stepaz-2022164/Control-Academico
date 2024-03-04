'use strict'

import Course from './course.model.js'
import Student from '../student/student.model.js'

export const createCourse = async (req, res) => {
    try {
        let { name, description } = req.body
        let teacherId = req.teacher._id
        let existingCourse = await Course.findOne({ name: name })
        if (existingCourse) return res.status(400).send({ message: 'Course already exists' })
        let course = new Course({
            name,
            description,
            teacher: teacherId
        })
        await course.save();
        return res.status(201).send({ message: 'Course created successfully' })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error creating course' })
    }
}

export const editCourse = async (req, res) => {
    try {
        let { cid } = req.params;
        let course = await Course.findOne({_id: cid});
        if (course.teacher.toString() !== req.teacher._id.toString()) {
            return res.status(403).send({ message: 'You are not authorized to update this course' })
        }
        let updatedCourse = await Course.findOneAndUpdate(
            {_id: cid},
            req.body, 
            { new: true }
        )
        return res.send({ message: 'Course updated successfully', course: updatedCourse })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error updating course' })
    }
}

export const deleteCourse = async (req, res) => {
    try {
        let { cid } = req.params
        let course = await Course.findById(cid)
        let student = await Student.findOne({courses: cid})
        if (course.teacher.toString() !== req.teacher._id.toString()) {
            return res.status(403).send({ message: 'You are not authorized to delete this course' })
        }
        let deleteCourse = await Course.findOneAndDelete({_id: cid})
        if (!deleteCourse) return res.status(404).send({message: 'Course not found and not deleted'})
        if (deleteCourse) {
            student.courses.pull(cid)
            await student.save()
        }
        return res.send({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error deleting course' })
    }
}
