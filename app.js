const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.json({ extended: true }))

//ROUTES//

//authorisation
app.use('/api/auth', require('./routes/auth.routes'))

//virtual machines
app.use('/api/vm', require('./routes/vm.routes'))

//server info
app.use('/api/server', require('./routes/serverInfo.routes'))

app.listen(5000, () => {
  console.log('Server has started on port 5000')
})
