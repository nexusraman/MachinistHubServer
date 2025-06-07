import DailyLog from '../models/dailyLog.js'
import ErrorResponse from '../utils/errorResponse.js'

// Create a single log
export const createDailyLog = async (req, res, next) => {
  const { date, relatedTo, comment } = req.body
  try {
    const log = await DailyLog.create({
      date,
      relatedTo,
      comment
    })
    res.status(201).json({ success: true, data: log })
  } catch (err) {
    next(err)
  }
}

// Create multiple logs
export const createMultipleLogs = async (req, res, next) => {
  const entries = req.body // expect array of { date, relatedTo, comment }
  if (!Array.isArray(entries) || entries.length === 0) {
    return next(new ErrorResponse('No entries provided', 400))
  }
  try {
    const docs = entries.map(e => ({
      date: e.date,
      relatedTo: e.relatedTo,
      comment: e.comment
    }))
    const created = await DailyLog.insertMany(docs)
    res.status(201).json({ success: true, count: created.length, data: created })
  } catch (err) {
    next(err)
  }
}

// Get all logs (no user filter)
export const getDailyLogs = async (req, res, next) => {
  try {
    const logs = await DailyLog.find().sort({ date: -1 })
    res.status(200).json({ success: true, count: logs.length, logs: logs })
  } catch (err) {
    next(err)
  }
}

// Get a single log by ID
export const getDailyLogById = async (req, res, next) => {
  try {
    const log = await DailyLog.findById(req.params.id)
    if (!log) {
      return next(new ErrorResponse('Log not found', 404))
    }
    res.status(200).json({ success: true, data: log })
  } catch (err) {
    next(err)
  }
}

// Delete a log by ID
export const deleteDailyLog = async (req, res, next) => {
  try {
    const log = await DailyLog.findById(req.params.id)
    if (!log) {
      return next(new ErrorResponse('Log not found', 404))
    }
    await log.remove()
    res.status(200).json({ success: true, message: 'Log deleted' })
  } catch (err) {
    next(err)
  }
}
