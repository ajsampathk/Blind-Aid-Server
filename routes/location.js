const express = require('express')
const dbClient = require('mongodb').MongoClient

const router = express.Router()
var url = 'mongodb://localhost:27017/'

router.post('/update', (req, res) => {
  global.res = res
  dbClient.connect(url, (err, db) => {
    if (err) {
      res.send('Failed to log')
    } else {
      global.db = db
      updateLocation(req)
    }
  })
})

function updateLocation (req) {
  var db = global.db.db('BAS')
  var LObject =
  {
    lat: req.body.location.lat,
    lng: req.body.location.lng,
    acc: req.body.accuracy,
    devID: req.body.id
  }
  db.collection('Locations').insertOne(LObject, (err, res) => {
    if (err) {
      global.res.send('Failed to log')
    } else global.res.send('Location Logged')
    global.db.close()
  })
}

module.exports = router
