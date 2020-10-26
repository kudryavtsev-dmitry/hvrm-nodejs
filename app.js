const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.json({extended: true}))

//ROUTES//

//authorisation
app.use('/api/auth', require('./routes/auth.routes'))

app.listen(5000, () => {
  console.log('Server has started on port 5000')
})