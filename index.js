const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

const morgan = require('morgan')

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body ', {
  skip: function (req, res) { return req.method != "POST" }
}))

app.use(morgan('tiny', {
  skip: function (req, res) { return req.method == "POST" }
}))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

//
// Routes
//
  app.get('/', (request, response) => {
    response.send('<h1>Express Server Status</h1><p>Online. <a href="/api/persons">/api/persons</a> for contents.')
  })

  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
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

  const generateId = () => {
    return Math.floor(Math.random() * 99999)
  }

  // Create new entry
  app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
      return response.status(400).json({
        error: 'content missing'
      })
    }

    const personExistsFlag = persons.some(person => person.name === body.name)

    if (!personExistsFlag) {
      const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
      }
    
      persons = persons.concat(person)
    
      response.json(person) 
    } else {
      return response.status(400).json({
        error: `${body.name} already exists`
      })
    }
  })

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})