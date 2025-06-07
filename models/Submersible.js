import mongoose from 'mongoose'

const submersibleSchema = mongoose.Schema({
  subId: { type: String, required: true, unique: true }, // ← NEW FIELD
  client: String,
  rotorSize: String,
  quantity: Number,
  date: {
    type: Date,
    default: Date.now,
  },
})

const Submersible = mongoose.model('Submersible', submersibleSchema)

export default Submersible
