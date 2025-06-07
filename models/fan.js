import mongoose from 'mongoose'

const fanSchema = mongoose.Schema({
  client: String,
  rotorSize: String,
  shaftSize: String,
  quantity: Number,
  date: {
    type: Date,
    default: Date.now,
  },
})

const fan = mongoose.model('Fan', fanSchema)

export default fan