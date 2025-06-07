import mongoose from 'mongoose'

const submersibleChartSchema = mongoose.Schema({
  size: String,
  price: Number,
})

const SubmersibleChart = mongoose.model('SubmersibleChart', submersibleChartSchema)

export default SubmersibleChart
