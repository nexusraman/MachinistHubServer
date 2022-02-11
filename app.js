
import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'
import entryRoutes from './routes/entry.js'
const app = express();

app.use(cors());

app.use('/entry', entryRoutes)

const CONNECT = 'mongodb+srv://admin:02012301@machinisthub.8zm6r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const PORT = process.env.PORT || 5000;
mongoose.connect(CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server Running on port ${PORT}`))
    ).catch((err) => {
        console.log(err.message)
    })

