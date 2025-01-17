import auth from './auth'
import candidate from './candidate'
import survey from './survey'
import city from './city'
import cohorte from './cohorte'
import diplome from './diplome'

const bodyParser = require('body-parser')
const app = require('express')()

app.use(bodyParser.json())
app.use(auth)
app.use(candidate)
app.use(survey)
app.use(city)
app.use(cohorte)
app.use(diplome)

module.exports = app
