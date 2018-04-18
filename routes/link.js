const express = require('express')
const dbClient = require('mongodb').MongoClient

var router = express.Router()
var url = 'mongodb://localhost:27017/'

router.post('/add', (req, res) => {
  global.req = req
  global.res = res
  dbClient.connect(url, function (err, db) {
    if (err) {
      console.log('Databse connection error')
      throw err
    } else {
      global.db = db
      addlink()
    }
  })
})

router.post('/getlinks', (req, res) => {
  global.req = req
  global.res = res
  dbClient.connect(url, function (err, db) {
    if (err) {
      console.log('Databse connection error')
      throw err
    } else {
      global.db = db
      getLinks()
    }
  })
})

function addlink () {
  var db = global.db.db('BAS')
  var did = global.req.body.id
  var pobject = {email: global.req.body.email, name: global.req.body.name}
  var query = {id: did}
  var object = {id: did, person: [pobject]}

  db.collection('Links').findOne(query, (err, res) => {
    if (err) {
      throw err
    } else {
      if (res === null) {
        db.collection('Links').insertOne(object, (err, res) => {
          if (err) {
            global.res.send(JSON.stringify({Success: false}))
            throw err
          } else {
            global.res.send(JSON.stringify({Success: true}))
          }
          global.db.close()
        })
      } else {
        db.collection('Links').update(query, { $push: { 'person': pobject } }, (err, res) => {
          if (err) {
            global.res.send(JSON.stringify({Success: false}))
          } else {
            global.res.send(JSON.stringify({Success: true}))
          }
          global.db.close()
        })
      }
    }
  })
}

function getLinks () {
  var db = global.db.db('BAS')
  var did = global.req.body.id
  var query = {id: did}

  db.collection('Links').findOne(query, (err, res) => {
    if (err) {
      global.res.send(JSON.stringify({Success: false}))
    } else {
      global.res.send(res.person)
    }
    global.db.close()
  })
}

module.exports = router
