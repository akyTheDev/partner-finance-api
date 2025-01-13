import express from 'express'

import {
  authMiddleware,
  errorMiddleware,
  loggerMiddleware,
} from './middlewares'
import userRouter from './modules/users'
import partnerRouter from './modules/partners'

const app = express()

app.use(express.json())

app.use(loggerMiddleware)
app.use(authMiddleware)

app.get('/', (_req, res) => {
  res.send('Hello World!')
})

app.use('/users', userRouter)
app.use('/partners', partnerRouter)

app.use(errorMiddleware)
export default app
