'use strict'

import Student from './student.model.js'
import Course from '../course/course.model.js'
import { encrypt, checkPassword } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'
import { checkUpdateUser } from '../utils/validator.js'

export const register = async (req, res) => {
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        let existingStudent = await Student.findOne({username: data.username})
        if (existingStudent) return res.status(400).send({ message: 'User already exists' })
        data.role = 'STUDENT'
        let student = new Student(data)
        await student.save()
        return res.send({message: 'Student saved successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error registering student'}, error)
    }
}

export const login = async (req,res) => {
    try {
        let {username, password} = req.body
        let student = await Student.findOne({username})
        if(student && await checkPassword(password, student.password)){
            let loggedStudent = {
                sid: student._id,
                username: student.username,
                name: student.name,
                surname: student.surname,
                role: student.role
            }
            let token = await generateJwt(loggedStudent)
            return res.send({
                message: `Welcome ${student.name}`,
                loggedStudent,
                token
            })
        }
        return res.status(404).send({message: 'Invalid credentials'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error logging in'})
    }
}

export const assignCourse = async (req, res) => {
    try {
        let studentId = req.student._id
        let student = await Student.findById(studentId).populate('courses')
        if (student.courses.length >= 3) {
            return res.status(400).send({ message: 'The student has already been assigned the maximum number of courses' })
        }
        let { courseId } = req.body
        if (student.courses.some(course => course._id.toString() === courseId)) {
            return res.status(400).send({ message: 'The course is already assigned to the student' })
        }
        let course = await Course.findOne({_id: courseId})
        if (!course) {
            return res.status(404).send({ message: 'Course not found' })
        }
        student.courses.push(courseId)
        await student.save()
        return res.send({ message: 'Course assigned successfully' })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error assigning course to student' })
    }
}

export const viewCourses = async (req, res) => {
    try {
        let studentId = req.student._id
        let student = await Student.findOne(studentId)
        let courses = await Course.find({_id: student.courses}).populate('courses' ['name', 'description'])
        return res.send({courses})
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error retrieving student courses' })
    }
}

export const editProfile = async (req, res) => {
    try {
        let data = req.body
        let studentIdL = req.student._id
        let studentIdU = req.params.id
        if (studentIdL.toString() !== studentIdU.toString()) return res.status(404).send({ message: 'You only can update your user'})
        let update = checkUpdateUser(data, studentIdU)
        if (!update) return res.status(400).send({ message: 'Can not update because you send some data that can not be updated or missing data' })
        let updatedStudent = await Student.findOneAndUpdate(
        {_id: studentIdU},
        data,
        { new: true })
        if (!updatedStudent) return res.status(401).send({message: 'User not found and not updated'})
        return res.send({message: 'User updated succesfully', updatedStudent})
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating student profile' })
    }
}

export const deleteProfile = async (req, res) => {
    try {
        let studentIdL = req.student._id
        let studentIdU = req.params.id
        if (studentIdL.toString() !== studentIdU.toString()) return res.status(404).send({ message: 'You only can delete your user'})
        let deleteUser = await Student.findOneAndDelete({_id: studentIdU})
        if (!deleteUser) return res.status(401).send({message: 'User not found and not deleted'})
        return res.send({ message: 'Student profile deleted successfully' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error deleting student profile' })
    }
}
