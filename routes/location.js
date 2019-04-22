const express = require('express')
const dbClient = require('mongodb').MongoClient
var notify = require('../helpers/notify.js')

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
        res.send(JSON.stringify({Success: false, Error: 'Database Error'}))
      } else {
        var cursor = db.db('BAS').collection('Locations').find({devID: req.body.id}).limit(1).sort({$natural: -1})
        cursor.toArray((err, res) => {
          if (err) {
            global.response.send(JSON.stringify({Success: false, Error: 'Device not found'}))
            throw err
          } else {
            // console.log(res)
            if (res) {
              global.response.send(JSON.stringify({email:res[0].email,lat: res[0].lat, lng: res[0].lng, acc: res[0].acc}))
            } else {
              global.response.send(JSON.stringify({Success: false, Error: 'Location not found'}))
            }
          }
        })
      }
    })
  } else {
    res.send(JSON.stringify({Success: false, Error: 'Device ID required'}))
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
    email: req.body.email
  }
  if (LObject.sos) {
    _notify(LObject.devID, LObject.lat, LObject.lng)
  }
  db.collection('Locations').insertOne(LObject, (err, res) => {
    if (err) {
      global.res.send('Failed to log')
    } else global.res.send('Location Logged')
    if (!LObject.sos)global.db.close()
  })
}

function _notify (devID, lat, lng) {
  var db = global.db.db('BAS')
  var did = devID
  var query = {id: did}

  db.collection('Links').findOne(query, (err, res) => {
    if (err) {
      console.log('Databse Error')
    } else {
      notify.notifylist(res.person, lat, lng, devID)
    }
    global.db.close()
  })
}

module.exports = router
