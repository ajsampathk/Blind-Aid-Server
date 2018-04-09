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

router.post('/getloc', (req, res) => {
  if (req.body.id) {
    global.response = res
    dbClient.connect(url, (err, db) => {
      if (err) {
        res.send('Database Error')
      } else {
        var cursor = db.db('BAS').collection('Locations').find({devID: req.body.id}).limit(1).sort({$natural: -1})
        cursor.toArray((err, res) => {
          if (err) {
            global.response.send('Device not found')
            throw err
          } else {
            console.log(res)
            if (res) {
              global.response.send(JSON.stringify({lat: res[0].lat, lng: res[0].lng, acc: res[0].acc}))
            } else {
              global.response.send('Could not locate device')
            }
          }
        })
      }
    })
  } else {
    res.send('Device ID required')
  }
})

function updateLocation (req) {
  var db = global.db.db('BAS')
  var LObject =
  {
    lat: req.body.location.lat,
    lng: req.body.location.lng,
    acc: req.body.accuracy,
    devID: req.body.id,
    sos: req.body.sos
  }
  db.collection('Locations').insertOne(LObject, (err, res) => {
    if (err) {
      global.res.send('Failed to log')
    } else global.res.send('Location Logged')
    global.db.close()
  })
}

module.exports = router
