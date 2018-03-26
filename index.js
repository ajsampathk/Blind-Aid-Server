const express = require('express')
const bodyParser = require('body-parser')
const dbClient = require('mongodb').MongoClient

const app = express()

var url = 'mongodb://localhost:27017/'
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(bodyParser.json())

app.listen(3020, () => console.log('Server running on port 3020'))

app.post('/signup', function (request, response) {
  global.req = request
  dbClient.connect(url, function (err, db) {
    if (err) {
      response.send(JSON.stringify({result: 'Failed'}))
      throw err
    } else {
      // console.log('connected to database')
      global.database = db
      insertUser()
      response.send(JSON.stringify({result: 'Success'}))
      db.close()
    }
  })
})

function insertUser () {
  var req = global.req
  var db = global.database.db('Users')
  var userobject = {username: req.body.username, key: req.body.password}
  db.collection('Users').insertOne(userobject, function (err, res) {
    if (err) throw err
    // console.log('Insert completed')
  })
}
