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
    user:{
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
    phone:{
        type: String,
        required: true
    },
    course:{
        type: Schema.ObjectId,
        ref: 'course',
        required: true
    }
})

export default model('teacher', teacherSchema)