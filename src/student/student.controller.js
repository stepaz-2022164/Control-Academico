'use strict'

import Student from './student.model.js'
import Course from '../course/course.model.js'
import { encrypt, checkPassword } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const register = async (req, res) => {
    try {
        let data = req.body
        data.password = await encrypt(data.password)
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
        const studentId = req.student._id;
        const student = await Student.findById(studentId).populate('courses');
        
        if (student.courses.length >= 3) {
            return res.status(400).send({ message: 'The student has already been assigned the maximum number of courses' });
        }

        const { courseId } = req.body;

        // Verificar si el curso ya está asignado al estudiante
        if (student.courses.some(course => course._id.toString() === courseId)) {
            return res.status(400).send({ message: 'The course is already assigned to the student' });
        }

        // Verificar si el curso existe
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).send({ message: 'Course not found' });
        }

        // Asignar el curso al estudiante
        student.courses.push(courseId);
        await student.save();

        return res.send({ message: 'Course assigned successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error assigning course to student' });
    }
}

export const viewCourses = async (req, res) => {
    try {
        const studentId = req.student._id
        const student = await Student.findById(studentId)
        return res.send(student.courses)
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error retrieving student courses' })
    }
}

export const editProfile = async (req, res) => {
    try {
        const studentId = req.student._id
        const updatedStudent = await Student.findByIdAndUpdate(studentId, req.body, { new: true })
        return res.send(updatedStudent)
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating student profile' })
    }
}

export const deleteProfile = async (req, res) => {
    try {
        const studentId = req.student._id
        await Student.findByIdAndDelete(studentId)
        return res.send({ message: 'Student profile deleted successfully' })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error deleting student profile' })
    }
}
