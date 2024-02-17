'use strict'

import express from 'express'
import {login, register} from './teacher.controller.js'

const api = express.Router()

api.post('/register', register)
api.post('/login', login)

export default api