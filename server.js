const express = require('express')


let app = express()
app.use(express.static('public'))
app.use(express.json())
let port = 3000

app.listen(port, () => {
   console.log(`Listening on port ${port}.`)
})