const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())

app.use(express.json())
app.use(morgan('tiny'))

//MUST use the built-in middleware from Express called static to make Express show static content
//static content == things like index.html and java script that is fetched
app.use(express.static('dist'))

//PERSONS MUST BE LET NOT CONST
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

//route 1: general route to the collection of persons
app.get('/api/persons',(request, response)=>{
    response.json(persons)
})

//route 2: specific route to an individual resource
app.get('/api/persons/:id',(request, response)=>{
    const id = request.params.id //where do i get a list of all the properties of the request?
    const person = persons.find(person => person.id === id)
    if (!person){ //person not found to get
        response.status(404).end()
    } else {
        response.json(person)
    }
})

//route 3: info page
app.get('/info',(request, response)=>{
    const date = new Date()
    response.send(
        `<p>Phonebook has information for ${persons.length} people</p><p>${date}</p>`
    )
})

//delete
app.delete('/api/persons/:id',(request, response)=>{
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

//post
const generateId = () => {
    let id
    while (true){
        let proposedId = Math.floor(Math.random()*(10000))
        if (!persons.map(p => Number(p.id)).find(n=>n===proposedId)){
            id=proposedId
            break}
        }
    return String(id)
}

app.post('/api/persons',(request,response)=>{
    const body = request.body
    console.log(request.body)
    if (!body.name || !body.number){
        return response.status(400).json({error: 'content missing'})
    }
    if (persons.find(p=>p.name===body.name)){
        return response.status(400).json({error: 'name must be unique'})
    }

    const newPerson = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(newPerson)
    response.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})