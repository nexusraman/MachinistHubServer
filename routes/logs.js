import express from 'express'
import {
  createDailyLog,
  createMultipleLogs,
  getDailyLogs,
  getDailyLogById,
  deleteDailyLog
} from '../controllers/dailyLog.js'

const router = express.Router()

router.post('/log', createDailyLog)
router.post('/log/multiple', createMultipleLogs)
router.get('/log', getDailyLogs)
router.get('/log/:id', getDailyLogById)
router.delete('/log/:id', deleteDailyLog)

export default router
