const express = require('express')
const app = express()
// app.get('/', (req, res) => {
//   res.send('HEY!')
// })
app.use(express.static('public'))

app.listen(3020, () => console.log('Server running on port 3020'))
