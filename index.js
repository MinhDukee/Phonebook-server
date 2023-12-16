const express = require('express')
var morgan = require('morgan')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
app.use(morgan(function (tokens, req, res) {
app.use(express.static('dist'))
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)    
  ].join(' ')
}))
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
  

app.get('/info', (request, response) => {
    let length = persons.length;
    const now = new Date();
  response.send(`<p> Phonebook has info for ${length} people.</p>
  <p> ${now} </p>
  `)
})
app.get('/api/persons', (request, response) => {
  response.json(persons)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person){
        response.json(person)
    } else {
        response.status(404).end()
    }
  })
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }
  
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    } if (persons.find(({name}) => name === body.name)){
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }

    const person = {
      id: getRandomInt(0,100000),
      name: body.name,
      number: body.number

    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})