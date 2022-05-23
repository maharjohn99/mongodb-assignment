import mongoose from 'mongoose'
import config from './index.js'

const CONNECTION_URL = `mongodb://${config.db.url}/${config.db.name}`

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
  console.log('MongoServer has connected succesfully')
})
mongoose.connection.on('reconnected', () => {
  console.log('MongoServer has reconnected')
})
mongoose.connection.on('error', error => {
  console.log('MongoConnection has an error', error)
  mongoose.disconnect()
})
mongoose.connection.on('disconnected', () => {
  console.log('MongoConnection is disconnected')
})
