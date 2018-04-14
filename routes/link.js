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
        })
      } else {
        db.collection('Links').update(query, { $push: { 'person': pobject } }, (err, res) => {
          if (err) {
            global.res.send(JSON.stringify({Success: false}))
          } else {
            global.res.send(JSON.stringify({Success: true}))
          }
        })
      }
    }
  })
}

module.exports = router
