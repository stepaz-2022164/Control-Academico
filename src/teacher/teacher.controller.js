'use strict'

import Teacher from './teacher.model.js'
import Course from '../course/course.model.js'
import { checkPassword, encrypt } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const defaultTeacher = async (name, surname, username, password, email) => {
    try {
        const existingTeacher = await Teacher.findOne({role: 'TEACHER'})

        if(!existingTeacher){
            const data = {
                name: name,
                surname: surname,
                username: username,
                password: await encrypt(password),
                email: email,
                role: 'TEACHER'
            }
            const teacher = new Teacher(data)
            await teacher.save()
            return console.log('Teacher by default created')
        } else {
            return console.log('Teacher by default already exists')
        }
    } catch (error) {
        console.error(error)
    }
}

export const register = async (req,res) => {
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        data.role = 'TEACHER'
        let teacher = new Teacher(data)
        await teacher.save()
        return res.send({message: 'Teacher saved successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error registering teacher'}, error)
    }
}

export const login = async (req,res) => {
    try {
        let {username, password} = req.body
        let teacher = await Teacher.findOne({username})
        if(teacher && await checkPassword(password, teacher.password)){
            let loggedTeachaer = {
                tid: teacher._id,
                username: teacher.username,
                name: teacher.name,
                surname: teacher.surname,
                role: teacher.role
            }
            let token = await generateJwt(loggedTeachaer)
            return res.send({
                message: `Welcome ${teacher.name}`,
                loggedTeachaer,
                token
            })
        }
        return res.status(404).send({message: 'Invalid credentials'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error logging in'})
    }
}

export const viewCourses = async (req, res) => {
    try {
        const teacherId = req.teacher._id
        const teacherName = req.teacher.name + ' ' +req.teacher.surname
        const courses = await Course.find({ teacher: teacherId })
        return res.send({ teacherName, courses })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error fetching teacher courses' })
    }
}