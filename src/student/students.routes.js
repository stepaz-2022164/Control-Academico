'use strict'

import express from 'express'
import { validateJwtStudent, isStudent } from '../middlewares/validate-jws-student.js'
import {register, login,assignCourse, viewCourses, editProfile, deleteProfile} from './student.controller.js'

const api = express.Router()

api.post('/register', register)
api.post('/login', login)
api.post('/assignCourse', validateJwtStudent, isStudent ,assignCourse)
api.get('/courses', validateJwtStudent, isStudent, viewCourses)
api.put('/editProfile', validateJwtStudent, isStudent, editProfile)
api.delete('/deleteProfile', validateJwtStudent, isStudent, deleteProfile)    

export default api