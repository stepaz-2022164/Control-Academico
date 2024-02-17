import { initServer } from './configs/app.js'
import { connect } from './configs/mongo.js'
import { defaultTeacher } from './src/teacher/teacher.controller.js'

initServer()
connect()
defaultTeacher('Josue', 'Noj', 'jnoj','123', 'jnoj@kinal.edu.gt')