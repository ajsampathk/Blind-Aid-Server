const express = require('express')
const bodyParser = require('body-parser')
const dbClient = require('mongodb').MongoClient
const crypto = require('crypto')

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
      UpdateUser(response)
      // console.log(state)
    }
  })
})

app.post('/login', function (req, res) {
  global.response = res
  dbClient.connect(url, function (err, db) {
    if (err) {
      res.send(JSON.stringify({result: 'Failed', error: 'InternalError'}))
      throw err
    } else {
      // console.log('connected to database')
      global.database = db
      auth(req)
    }
  })
})

function UpdateUser (response) {
  var req = global.req
  var db = global.database.db('Users')
  db.collection('Users').findOne({username: req.body.username}, function (err, res) {
    if (err) throw err
    // console.log(res)
    if (res === null) {
      insertUser()
      response.send(JSON.stringify({result: 'Success', error: null}))
    } else response.send(JSON.stringify({result: 'Failed', error: 'ExistentUser'}))
  })
}

function insertUser () {
  var req = global.req
  var db = global.database.db('Users')

  var authKey = crypto.createHash('md5').update(req.body.username).digest('hex')
  // console.log(authKey)
  var userobject = {username: req.body.username, password: req.body.password, key: authKey}
  db.collection('Users').insertOne(userobject, function (err, res) {
    if (err) throw err
    // console.log('Insert completed')
  })
  global.database.close()
}

function auth (req) {
  var db = global.database.db('Users')
  var query = {username: req.body.username}
  // console.log(query)
  db.collection('Users').findOne(query, function (err, res) {
    if (err) throw err

    if (res !== null) {
      if (res.password === req.body.password) {
        global.response.send(JSON.stringify({result: 'Success', key: res.key}))
      } else {
        global.response.send(JSON.stringify({result: 'Failed', error: 'InvalidKey'}))
      }
    } else global.response.send(JSON.stringify({result: 'Failed', error: 'dataMismatch'}))

    global.database.close()
  })
}
