//Importaciones
import express from 'express'
import bcrypt from 'bcrypt'
import {config} from 'dotenv'

const app = express()
config()
const port = process.env.PORT || 3200

app.use(express.urlencoded({extended: false}))
app.use(express.json()) 

export const initServer = () => {
    app.listen(port)
    console.log(`Server running on port ${port}`)
} 