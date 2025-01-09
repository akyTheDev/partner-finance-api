import { faker } from '@faker-js/faker'

import { testRequest } from '../setup'

describe('User E2E', () => {
  describe('Register', () => {
    it('should return an error if validation fails', async () => {
      const response = await testRequest().post('/users/register').send({
        name: 'Test User',
        email: 'invalidemail',
        password: 'password123',
      })

      expect(response.status).toBe(422)
    })
  })

  it('should successfully register a new user', async () => {
    const response = await testRequest().post('/users/register').send({
      name: 'Test User',
      email: faker.internet.email(),
      password: 'password123',
    })

    expect(response.status).toBe(201)
  })
})
