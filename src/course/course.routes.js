'use strict'

import express from 'express'
import { validateJwt, isTeacher, owner } from '../middlewares/validate-jwt.js'
import { createCourse, deleteCourse, editCourse } from './course.controller.js'

const api = express.Router()

api.post('/createCourse', validateJwt, isTeacher, createCourse)
api.put('/editCourse/:cid', validateJwt, isTeacher, owner, editCourse)
api.delete('/deleteCourse/:cid', validateJwt, isTeacher, owner, deleteCourse)

export default api