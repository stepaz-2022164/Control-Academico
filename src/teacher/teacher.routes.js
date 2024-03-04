'use strict'

import express from 'express'
import {deleteProfile, editProfile, login, register, viewCourses} from './teacher.controller.js'
import { validateJwt, isTeacher } from '../middlewares/validate-jwt.js'

const api = express.Router()

api.post('/register', register)
api.post('/login', login)
api.get('/viewCourses',[validateJwt,isTeacher] ,viewCourses)
api.delete ('/deleteProfile/:id',[ validateJwt,isTeacher], deleteProfile)
api.put('/editProfile/:id',[validateJwt,isTeacher], editProfile)

export default api