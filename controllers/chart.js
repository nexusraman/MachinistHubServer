import SubmersibleChart from '../models/submersibleChart.js'

export const getSubmersibleChart = async (req, res) => {
  try {
    const chart = await SubmersibleChart.find()

    res.status(200).json(chart)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const createSubmersibleChart = async (req, res) => {
  const chart = req.body
  const newChart = new SubmersibleChart(chart)

  try {
    await newChart.save()

    res.status(201).json(newChart)
  } catch (err) {
    res.status(409).json({ message: err.message })
  }
}
