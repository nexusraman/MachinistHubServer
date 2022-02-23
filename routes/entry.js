import express from 'express';
import { getEntry } from '../controllers/entry.js';
const router = express.Router();

router.get('/', getEntry)

export default router