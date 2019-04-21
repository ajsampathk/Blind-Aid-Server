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

router.post('/adddev', (req, res) => {
  global.res = res
  dbClient.connect(url, function (err, db) {
    if (err) {
      console.log('Databse connection error')
      throw err
    } else {
      global.db = db
      adddev(req.body)
    }
  })
})

router.post('/getdev', (req, res) => {
  global.req = req
  global.res = res
  dbClient.connect(url, function (err, db) {
    if (err) {
      console.log('Databse connection error')
      throw err
    } else {
      global.db = db
      getdevs(req.body)
    }
  })
})

function UpdateUser (response) {
  var req = global.req
  var db = global.database.db('BAS')
  db.collection('Users').findOne({username: req.body.email}, function (err, res) {
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
      username: req.body.email,
      password: req.body.password,
      email: req.body.email,
      phone: req.body.phone,
      devs: []
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
  var query = {username: req.body.email}
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

function adddev (data) {
  var db = global.db.db('BAS')
  var query = {username: data.email}
  var dev = data.dev
  db.collection('Users').update(query, { $addToSet: { 'devs': dev } }, (err, res) => {
    if (err) {
      global.res.send(JSON.stringify({Success: false}))
    } else {
      global.res.send(JSON.stringify({Success: true}))
    }
    global.db.close()
  })
}

function getdevs (data) {
  var db = global.db.db('BAS')
  var query = {username: data.email}

  db.collection('Users').findOne(query, (err, res) => {
    if (err) {
      global.res.send(JSON.stringify({Success: false}))
    } else {
      global.res.send(JSON.stringify({devs: res.devs}))
    }
    global.db.close()
  })
}

module.exports = router
