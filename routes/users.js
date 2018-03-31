const express = require('express')
const dbClient = require('mongodb').MongoClient
const crypto = require('crypto')

var router = express.Router()
var url = 'mongodb://localhost:27017/'

router.post('/signup', function (request, response) {
  global.req = request
  dbClient.connect(url, function (err, db) {
    if (err) {
      response.send(JSON.stringify({result: 'Failed', error: 'InternalError'}))
      throw err
    } else {
      // console.log('connected to database')
      global.database = db
      UpdateUser(response)
      // console.log(state)
    }
  })
})

router.post('/login', function (req, res) {
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
  var db = global.database.db('BAS')
  db.collection('Users').findOne({username: req.body.username}, function (err, res) {
    if (err) {
      response.send(JSON.stringify({result: 'Failed', error: 'InternalError'}))
      throw err
    }
    // console.log(res)
    if (res === null) {
      insertUser(response)
      response.send(JSON.stringify({result: 'Success', error: null}))
    } else response.send(JSON.stringify({result: 'Failed', error: 'ExistentUser'}))
  })
}

function insertUser (response) {
  var req = global.req
  var db = global.database.db('BAS')

  req.body.password = secure(req.body.password)
  // console.log(key)

  var userobject =
    {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      phone: req.body.phone
    }

  db.collection('Users').insertOne(userobject, function (err, res) {
    if (err) {
      response.send(JSON.stringify({result: 'Failed', error: 'InternalError'}))
      throw err
    }
  })
  global.database.close()
}

function auth (req) {
  var db = global.database.db('BAS')
  var query = {username: req.body.username}
  // console.log(query)
  db.collection('Users').findOne(query, function (err, res) {
    if (err) {
      global.response.send(JSON.stringify({result: 'Failed', error: 'InternalError'}))
      throw err
    }

    if (res !== null) {
      if (res.password === secure(req.body.password)) {
        global.response.send(JSON.stringify({result: 'Success'}))
      } else {
        global.response.send(JSON.stringify({result: 'Failed', error: 'InvalidKey'}))
      }
    } else global.response.send(JSON.stringify({result: 'Failed', error: 'dataMismatch'}))

    global.database.close()
  })
}

function secure (password) {
  var res = crypto.createHash('md5').update(password).digest('hex')
  return res
}

module.exports = router
