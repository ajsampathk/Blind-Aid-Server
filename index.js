const express = require('express')
// const bodyParser = require('body-parser')

const app = express()

app.use(express.static('public'))
// app.use(bodyParser.json())
app.post('/comm', function (request, response) {
  var result = {result: 'Success,recieved ', data: request.body}
  // var responsejson = response.body
  // result = result.concat(responsejson)
  // response.send(request.body)
  response.send(JSON.stringify(result))
})

app.listen(3020, () => console.log('Server running on port 3020'))
