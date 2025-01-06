import { testRequest } from '../setup'

describe('User E2E', () => {
  describe('Login', () => {
    it('should return an error if user not found', async () => {
      const response = await testRequest().post('/users/login').send({
        email: 'invalidemail@mail.com',
        password: 'password123',
      })

      expect(response.status).toBe(401)
    })
  })

  it('should successfully login', async () => {
    const response = await testRequest().post('/users/login').send({
      email: 'test1@test.com',
      password: '12345678',
    })

    expect(response.status).toBe(201)
  })
})
