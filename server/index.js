import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import cron from 'node-cron'

import userRoutes from './routes/users.js'
import questionRoutes from './routes/Questions.js'
import answerRoutes from './routes/Answers.js'
import otpRoutes from './routes/chatback.js'
import planRoutes from './routes/plan.js'

import { task } from './controllers/Plans.js'
import { todo } from './controllers/Plans.js'

//const allowedOrigins = ['http://localhost:3000'];

const app = express();
dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.get('/',(req, res) => {
    res.send("This is a stack overflow clone API")
})

app.use('/user', userRoutes)
app.use('/questions', questionRoutes)
app.use('/answer', answerRoutes)
app.use('/', otpRoutes)
app.use('/', planRoutes)

const PORT = process.env.PORT || 5000

cron.schedule('0 0 * * *', () => {
  task.start()
});

cron.schedule('0 0 */30 * *', () => {
  todo.updatePlan()
});

const DATABASE_URL = process.env.CONNECTION_URL

mongoose.connect( DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true} )
    .then(() => app.listen(PORT, () => {console.log(`server running on port ${PORT}`)}))
    .catch((err) => console.log(err.message))