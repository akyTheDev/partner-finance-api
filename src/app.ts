import express from 'express'

import { errorMiddleware, loggerMiddleware } from './middlewares'
import userRouter from './modules/users'

const app = express()

app.use(express.json())

app.use(loggerMiddleware)
// app.use(authMiddleware)

app.get('/', (_req, res) => {
  res.send('Hello World!')
})

// app.use('/banks', bankRouter)
// app.use('/currencies', currencyRouter)
app.use('/users', userRouter)

app.use(errorMiddleware)
export default app
