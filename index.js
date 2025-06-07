import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

import clientRoutes from './routes/clients.js'
import expenseRoutes from './routes/expenses.js'
import authRoutes from './routes/auth.js'
import dailyLogRoutes from './routes/logs.js' 

dotenv.config()

const app = express()

// Body parser
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

// CORS
app.use(cors())

// MongoDB connection
const CONNECTION_URL = process.env.MONGO_URI ||  
  'mongodb+srv://nexusraman:Dignity!2301@machinisthub.8zm6r.mongodb.net/MachinistHub?retryWrites=true&w=majority'
const PORT = process.env.PORT || 5000

mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch((err) => console.log(err.message))

// ROUTES
app.use('/', clientRoutes)
app.use('/', expenseRoutes)
app.use('/auth', authRoutes)
app.use('/', dailyLogRoutes)   // <= mount daily logs here

// (Optionally, add a global error handler here)

export default app
