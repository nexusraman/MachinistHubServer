import express from 'express'
import {
  createExpense,
  bulkCreateExpense,
  getExpense,
  getTotalExpense,
  deleteEntry
} from '../controllers/expense.js'

import {
  createIncome,
  bulkCreateIncome,
  getIncome,
  getTotalIncome
} from '../controllers/expense.js'

import {
  getSubmersibleChart,
  createSubmersibleChart
} from '../controllers/chart.js'

import {
  createSubmersible,
  createMultipleSubmersibles,
  getSubmersible,
  deleteSub,
} from '../controllers/Submersible.js'

import {
  createFan,
  createMultipleFans,
  getFan,
  deleteFan,
  deleteMultipleFans,
  createFanRotor,
  createMultipleFanRotors,
  getFanRotor,
  deleteFanRotor,
  deleteMultipleFanRotors
} from '../controllers/Fan.js'

const router = express.Router()

// Expense routes
router.post('/expense', createExpense)
router.post('/expense/multiple', bulkCreateExpense)
router.get('/expense', getExpense)
router.get('/totalExpense', getTotalExpense)
router.post('/deleteEntry', deleteEntry)

// Income routes
router.post('/income', createIncome)
router.post('/income/multiple', bulkCreateIncome)
router.get('/income', getIncome)
router.get('/totalIncome', getTotalIncome)
router.post('/deleteEntry ', deleteEntry)

// Submersible chart routes
router.get('/submersibleChart', getSubmersibleChart)
router.post('/submersibleChart', createSubmersibleChart)

// Submersible routes
router.post('/submersible', createSubmersible)
router.post('/submersible/multiple', createMultipleSubmersibles)
router.get('/submersible', getSubmersible)
router.post('/deleteSub', deleteSub)
// router.post('/deleteMultipleSub', deleteMultipleSubmersibles)

// Fan routes
router.post('/fan', createFan)
router.post('/fan/multiple', createMultipleFans)
router.get('/fan', getFan)
router.post('/deleteFan', deleteFan)
router.post('/deleteMultipleFan', deleteMultipleFans)

// Fan Rotor routes
router.post('/fanRotor', createFanRotor)
router.post('/fanrotor/multiple', createMultipleFanRotors)
router.get('/fanRotor', getFanRotor)
router.post('/deleteFanRotor', deleteFanRotor)
router.post('/deleteMultipleFanRotor', deleteMultipleFanRotors)

export default router
