import { Server } from 'http'
import request from 'supertest'

import app from '../src/app'

let server: Server

beforeAll((done) => {
  server = app.listen(0, () => done())
})

export const testRequest = () => request(server)
