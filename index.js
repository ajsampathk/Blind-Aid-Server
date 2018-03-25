const express = require('express')
const bodyParser = require('body-parser')
const dbClient = require('mongodb').MongoClient

const app = express()

var url = 'mongodb://localhost:27017/'
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(bodyParser.json())

app.post('/signup', function (request, response) {
  var result = {result: 'Success'}

  dbClient.connect(url, function (err, db) {
    if (err) {
      response.send(JSON.stringify({result: 'Failed'}))
      throw err
    } else {
      console.log('connected to database')
      global.database = db
      response.send(JSON.stringify(result))
    }
  })

  // result = jsonConcat(result, request.body)
  // console.log(result)
})
app.listen(3020, () => console.log('Server running on port 3020'))
