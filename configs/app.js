//Importaciones
import express from 'express'
import {config} from 'dotenv'
import studentRoutes from '../src/student/students.routes.js'
import teacherRoutes from '../src/teacher/teacher.routes.js'

const app = express()
config()
const port = process.env.PORT || 3200

app.use(express.urlencoded({extended: false}))
app.use(express.json()) 

app.use('/student', studentRoutes)
app.use('/teacher', teacherRoutes)

export const initServer = () => {
    app.listen(port)
    console.log(`Server running on port ${port}`)
} 