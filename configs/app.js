//Importaciones
import express from 'express'
import {config} from 'dotenv'
import studentRoutes from '../src/student/students.routes.js'
import teacherRoutes from '../src/teacher/teacher.routes.js'
import courseRoutes from '../src/course/course.routes.js'
import { defaultTeacher } from '../src/teacher/teacher.controller.js'

const app = express()
config()
const port = process.env.PORT || 3200

app.use(express.urlencoded({extended: false}))
app.use(express.json()) 

app.use('/student', studentRoutes)
app.use('/teacher', teacherRoutes)
app.use('/course', courseRoutes)

export const initServer = () => {
    defaultTeacher()
    app.listen(port)
    console.log(`Server running on port ${port}`)
} 