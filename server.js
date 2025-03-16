const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app')

dotenv.config({ path: './config.env' })

mongoose
  .connect(process.env.URL)
  .then(() => console.log('connected to MOngodb'))
  .catch((err) => console.error(err))

const port = process.env.PORT || 8001

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})
