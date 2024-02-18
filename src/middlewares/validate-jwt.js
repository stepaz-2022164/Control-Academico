'use strict'

import jwt from 'jsonwebtoken'
import Teacher from '../teacher/teacher.model.js'
import Course from '../course/course.model.js'

export const validateJwt = async (req, res, next) => {
    try {
        let secretkey = process.env.SECRET_KEY
        let {token} = req.headers
        if(!token) return res.status(401).send({message: 'Unauthorized'})
        let {tid} = jwt.verify(token, secretkey)
        let teacher = await Teacher.findOne({_id: tid})
        if(!teacher) return res.status(401).send({message: 'Teacher not found - Unauthorized'})
        req.teacher = teacher
        next()
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error verifying token'})
    }
}

export const isTeacher = async (req, res, next) => {
    try {
        let {role, username} = req.teacher
        if(!role || role !== 'TEACHER') return res.status(403).send({message: `You dont have access ${username}`})
        next()
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Unauthorized role'})
    }
}

//Verfica si el curso le pertenece
export const owner = async (req, res, next) => {
    try {
        let {_id} = req.teacher
        let {cid} = req.params
        let course = await Course.findOne({_id: cid})
        if(!course) return res.status(404).send({message: 'Course not found'})
        if(course.teacher == _id) {
            return next()
        } 
        return next()
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Unauthorized action'})
    }
}