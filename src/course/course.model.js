'use strict'

import { Schema, model } from "mongoose"

const courseSchema = Schema({
    name: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    }
})

export default model('couser', courseSchema)