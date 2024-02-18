'use strict'

import jwt from 'jsonwebtoken'
import Student from '../student/student.model.js'

export const validateJwtStudent = async (req, res, next) => {
    try {
        let secretkey = process.env.SECRET_KEY
        let {token} = req.headers
        if(!token) return res.status(401).send({message: 'Unauthorized'})
        let {sid} = jwt.verify(token, secretkey)
        let student = await Student.findOne({_id: sid})
        if(!student) return res.status(401).send({message: 'Teacher not found - Unauthorized'})
        req.student = student
        next()
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error verifying token'})
    }
}

export const isStudent = async (req, res, next) => {
    try {
        let {role, username} = req.student
        if(!role || role !== 'STUDENT') return res.status(403).send({message: `You dont have access ${username}`})
        next()
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Unauthorized role'})
    }
}

