// PHONEBOOK SERVER

// Express server. Frontend located at the following URL:
// https://github.com/seanodaniels/University-of-Helsinki-Fullstack-Open/tree/main/part02/the-phonebook
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const Person = require('./models/person')
 
const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

// Morgan setup
morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body ', {
  skip: function (req, res) { return req.method != "POST" }
}))
app.use(morgan('tiny', {
  skip: function (req, res) { return req.method == "POST" }
}))

//
// Routes
//
  app.get('/', (request, response) => {
    response.send('<h1>Express Server Status</h1><p>Online. <a href="/api/persons">/api/persons</a> for contents.')
  })

  app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
      response.json(person)
    })
  })

  app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
  })

  // Info
  app.get('/info', (request, response) => {
    const getTime = new Date().toString()
    const personsCount = Object.keys(persons).length
    console.log("length:", personsCount)
    response.send(`<p>Phonebook has info for ${personsCount} people</p><p>${getTime}</p>`)

  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
  })

  // Create new entry
  app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.content === undefined || !body.number) {
      return response.status(400).json({
        error: 'content missing'
      })
    }

    const personExistsFlag = persons.some(person => person.name === body.name)

    if (!personExistsFlag) {
      const person = new Person({
        name: body.name,
        number: body.number,
      })

      person.save().then(savedPerson => {
        response.json(savedPerson)
      })
    } else {
      return response.status(400).json({
        error: `${body.name} already exists`
      })
    }
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })