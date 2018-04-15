const express = require('express')
const bodyParser = require('body-parser')

const app = express()

var locations = require('./routes/location.js')
var users = require('./routes/users.js')
var link = require('./routes/link.js')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(bodyParser.json())

app.listen(3020, () => console.log('Server running on port 3020'))

app.use('/location', locations)
app.use('/user', users)
app.use('/link', link)

app.post('/testjson', (req, res) => {
  res.send(JSON.stringify({Success: true}))
})
