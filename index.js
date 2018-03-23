const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.post('/', function (request, response) {
  var result = {result: 'Success recieved '}
  // response.send(request.body)
  response.send(JSON.stringify(result.concat(request.body)))
})

app.listen(3020, () => console.log('Server running on port 3020'))
