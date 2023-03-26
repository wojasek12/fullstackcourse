const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.use(morgan((tokens, req, res) => {
  if(req.method !== 'POST') {
      return null
  }
  else {
      return [
          tokens.method(req, res),
          tokens.url(req, res),
          tokens.status(req, res),
          tokens.res(req, res, 'content-length'), '-',
          tokens['response-time'](req, res), 'ms',
          JSON.stringify(req.body)
      ].join(' ')
  }
}))

app.post('/api/notes', (request, response) => {
    const body = request.body
    if(!body.name){
        return response.status(404).json({"error": "name missing"})
    }else if(persons.find(person => person.name === body.name)){
        return response.status(404).json({"error": "name already appears in phonebook"})
    }
    const id = Math.floor(Math.random() * 1001)
    const person = {
        'id': id,
        'name': request.body.name,
        'number': request.body.number
    }
    persons = persons.concat(person)
    response.send(person)
})

app.use(morgan('tiny'))
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    if(persons.map(person => person.id).includes(id)) {
        persons = persons.filter(person => person.id !== id)
        response.status(204).end()
    }else{
        response.statusMessage = 'no such a person'
        response.status(404).end()
    }
})

app.get('/api/notes', (request, response) => {
    response.json(persons)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person) {
        response.send(person)
    }else{
        response.statusMessage = 'no such person'
        response.status(404)
        // mozna tez dac na koniec status(404).end() i tez sie wysle
        response.send('<h1> Nou sacz nout </h1>')
    }

})

const renderWebpage = () => {
    const numberOfPeople = persons.length
    const date = new Date()
    const webpage =
        `Phonebook has info for ${numberOfPeople} people</br>
         ${date}`
    return webpage
}

app.get('/info', (request, response) => {
    const webpage = renderWebpage()
    response.send(webpage)
})


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

const port = 3001
app.listen(port, () => {
    console.log("server is running on some port")
})