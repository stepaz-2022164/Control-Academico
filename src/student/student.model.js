'use strict'

import { Schema, model } from "mongoose"

const studentSchema = Schema({
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
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'course'
    }],
    role: {
        type: String,
        required: true
    }
})  
export default model('student', studentSchema)