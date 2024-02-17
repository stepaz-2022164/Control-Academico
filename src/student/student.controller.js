'use strict'

import Student from './student.model.js'
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
                loggedStudent
            })
        }
        return res.status(404).send({message: 'Invalid credentials'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error logging in'})
    }
}