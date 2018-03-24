const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(bodyParser.json())
app.post('/comm', function (request, response) {
  var result = {result: 'Success,recieved '}
  result = jsonConcat(result, request.body)
  console.log(result)
  response.send(JSON.stringify(result))
})

app.listen(3020, () => console.log('Server running on port 3020'))

function jsonConcat (object1, object2) {
  for (var key in object2) {
    object1[key] = object2[key]
  }
  return object1
}
