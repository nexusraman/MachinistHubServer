import express from 'express'
import {
  getAllClients,
  getClientById,  // ← NEW
  createClient
} from '../controllers/clients.js'

const router = express.Router()

// GET all clients
router.get('/client', getAllClients)

// GET single client by ID → /client/:id
router.get('/client/:id', getClientById)  // ← NEW

// POST create new client
router.post('/client', createClient)

export default router
