'user strict'

import { Schema, model } from "mongoose"

const teacherSchema = Schema({
    name:{
        type: String,
        required: true
    },
    surname:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
})

export default model('teacher', teacherSchema)