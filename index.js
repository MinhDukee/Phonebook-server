const Person = require('./models/person')
const express = require('express')
var morgan = require('morgan')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
app.use(morgan(function (tokens, req, res) {
	app.use(express.static('dist'))
	const errorHandler = (error, request, response, next) => {
		console.error(error.message)

		if (error.name === 'CastError') {
			return response.status(400).send({ error: 'malformatted id' })
		} else if (error.name === 'ValidationError') {
			return response.status(400).send({ error: error.message })
		}

		next(error)
	}

	app.use(errorHandler)

	return [
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, 'content-length'), '-',
		tokens['response-time'](req, res), 'ms',
		JSON.stringify(req.body)
	].join(' ')
}))

let persons = []


app.get('/info', (request, response) => {
	let length = persons.length
	const now = new Date()
	response.send(`<p> Phonebook has info for ${length} people.</p>
  <p> ${now} </p>
  `)
})
app.get('/api/persons', (request, response) => {
	async function dosomething(){
		const persons = await Person.find({})
		response.json(persons)
	}
	dosomething()
})
app.get('/api/persons/:id', (request, response, next) => {

	Person.findById(request.params.id)
		.then(person => {
			if (person) {
				response.json(person)
			} else {
				response.status(404).end()
			}
		})
		.catch(error => {
			next(error)
		})
})
app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndDelete(request.params.id)
		.then(result => {
			response.json(result)
			response.status(204).end()
		})
		.catch(error => next(error))
})

function getRandomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min) + min)
}

app.post('/api/persons', (request, response, next) => {
	const body = request.body

	if (!body.name) {
		return response.status(400).json({
			error: 'name missing'
		})
	} if (persons.find(({ name }) => name === body.name)){
		return response.status(400).json({
			error: 'name must be unique'
		})
	}

	const person = new Person({
		id: getRandomInt(0,100000),
		name: body.name,
		number: body.number

	})

	person.save()
		.then(savedPerson => {
			response.json(savedPerson)
		})
		.catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body
	const person = {
		number: body.number
	}

	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then(updatedPerson => {
			response.json(updatedPerson)
		})
		.catch(error => next(error))
})

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})