import cors from 'cors'
import express from 'express'

import {
  authMiddleware,
  errorMiddleware,
  loggerMiddleware,
} from './middlewares'
import partnerRouter from './modules/partners'
import userRouter from './modules/users'

const app = express()
app.use(cors())
app.use(express.json())

app.use(loggerMiddleware)
app.use(authMiddleware)

app.use('/users', userRouter)
app.use('/partners', partnerRouter)

app.use(errorMiddleware)
export default app
