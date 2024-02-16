'use strict'

import mongoose from "mongoose"

export const connect = async() => {
    try {
        mongoose.connection.on('connected', () => console.log('MongoDB | Connected to MongoDB'))
        mongoose.connection.on('open', ()=> console.log('MongoDB | connected to database'))

        return await mongoose.connect('mongodb://127.0.0.1:27017/DBControlAcademico2022164')
    } catch (error) {
        console.error({message: 'Database connection error'})
    }
}