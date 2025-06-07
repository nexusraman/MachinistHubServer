import mongoose from 'mongoose'

const fanRotor = mongoose.Schema({
  client: String,
  rotorSize: String,
  quantity: Number,
  date: {
    type: Date,
    default: Date.now,
  },
})

const fanRotorInventory = mongoose.model('FanRotor', fanRotor)

export default fanRotorInventory