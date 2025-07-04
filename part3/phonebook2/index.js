import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const express = require('express')
const morgan = require('morgan')
const app = express()
const Contact = require('./mongo')
const errorHandler = require('./errorHandler')
const unknownEndpoint = require('./unknownEndpoint')

morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (req, res) => {

  Contact.find({}).then(cnts => {

    res.send(`
      Phonebook has info for ${cnts.length} people<br><br>
      ${new Date()}
    `)
  })
})

app.get('/api/persons', (req, res) => {

  Contact.find({}).then(cnts => {

    res.json(cnts)
  })
})

app.get('/api/persons/:id', (req, res, next) => {

  const id = req.params.id

  Contact
    .findById(id)
    .then(cnt => {

      if (cnt) {

        res.json(cnt)
      } else {

        res.status(404).json({error: 'unknown endpoint'})
      }
    })
    .catch(err => next(err))
})

app.post('/api/persons', (reqP, resP, next) => {

  const {name, number} = reqP.body

  const contact = new Contact({
    name,
    number
  })

  contact
    .save()
    .then(resS => {

      resP.json(resS)
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {

  const id = req.params.id
  const {name, number} = req.body

  Contact
    .findByIdAndUpdate(id, {name, number}, {runValidators: true})
    .then(cnt => {

      res.json(cnt)
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {

  const id = req.params.id

  Contact
    .findByIdAndDelete(id)
    .then(() => 
      res.status(204).end()
    )
    .catch(err => 
      next(err)
    )
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
})

app.use(errorHandler)