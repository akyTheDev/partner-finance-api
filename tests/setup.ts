import { Server } from 'http'
import request from 'supertest'
import jwt from 'jsonwebtoken'

import app from '../src/app'
import { config } from '../src/common/config'

let server: Server

beforeAll((done) => {
  server = app.listen(0, () => done())
})

export const testRequest = () => request(server)
export const generateJwtToken = (userId: number) => {
  return jwt.sign(
    {
      userId,
    },
    config.JWT_SECRET,
  )
}
