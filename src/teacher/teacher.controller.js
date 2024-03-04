'use strict'

import Teacher from './teacher.model.js'
import Course from '../course/course.model.js'
import { checkPassword, encrypt, checkUpdateUser } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const defaultTeacher = async () => {
    try {
        let existingTeacher = await Teacher.findOne({username: 'jnoj'})
        if(!existingTeacher){
            let data = {
                name: 'Josue',
                surname: 'Noj',
                username: 'jnoj',   
                password: await encrypt('12345'),
                email: 'jnoj@kinal.edu.gt',
                role: 'TEACHER'
            }
            let teacher = new Teacher(data)
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
        let teacherId = req.teacher._id
        let teacherName = req.teacher.name + ' ' +req.teacher.surname
        let courses = await Course.find({ teacher: teacherId })
        return res.send({ teacherName, courses })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error fetching teacher courses' })
    }
}

export const editProfile = async (req, res) => {
    try {
        let data = req.body
        let teacherIdL = req.teacher._id
        let teacherIdU = req.params.id
        if (teacherIdL.toString() !== teacherIdU.toString()) return res.status(404).send({ message: 'You only can update your user'})
        let update = checkUpdateUser(data, teacherIdU)
        if (!update) return res.status(400).send({ message: 'Can not update because you send some data that can not be updated or missing data' })
        let updatedTeacher = await Teacher.findOneAndUpdate(
        {_id: teacherIdU},
        data,
        { new: true })
        if (!updatedTeacher) return res.status(401).send({message: 'User not found and not updated'})
        return res.send({message: 'User updated succesfully', updatedTeacher})
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating student profile' })
    }
}

export const deleteProfile = async (req, res) => {
    try {
        let teacherIdL = req.teacher._id
        let teacherIdU = req.params.id
        if (teacherIdL.toString() !== teacherIdU.toString()) return res.status(404).send({ message: 'You only can delete your user'})
        let deletedTeacher = await Teacher.findOneAndDelete({_id: teacherIdU})
        if (!deletedTeacher) return res.status(401).send({message: 'User not found and not deleted'})
        return res.send({message: 'User deleted succesfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error deleting teacher profile' })
    }
}