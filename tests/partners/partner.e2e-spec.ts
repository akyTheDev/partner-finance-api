import { faker } from '@faker-js/faker'

import { generateJwtToken, testRequest } from '../setup'

describe('Partner E2E', () => {
  describe('Create', () => {
    it('should return 401 if token not send', async () => {
      const partnerName = faker.string.alpha(10)

      const response = await testRequest().post('/partners').send({
        name: partnerName,
      })

      expect(response.status).toBe(401)
    })
    it('should create a partner successfully', async () => {
      const partnerName = faker.string.alpha(10)

      const response = await testRequest()
        .post('/partners')
        .set('Authorization', `Bearer ${generateJwtToken(1)}`)
        .send({
          name: partnerName,
        })

      expect(response.status).toBe(201)
    })
  })

  describe('GetAll', () => {
    it('should return 200', async () => {
      const response = await testRequest()
        .get('/partners')
        .set('Authorization', `Bearer ${generateJwtToken(1)}`)

      expect(response.status).toBe(200)
    })

    it('should return 404', async () => {
      const response = await testRequest()
        .get('/partners')
        .set('Authorization', `Bearer ${generateJwtToken(3)}`)

      expect(response.status).toBe(404)
    })
  })

  describe('GetOne', () => {
    it('should return 200', async () => {
      const response = await testRequest()
        .get('/partners/10')
        .set('Authorization', `Bearer ${generateJwtToken(1)}`)

      expect(response.status).toBe(200)
    })

    it('should return 404', async () => {
      const response = await testRequest()
        .get('/partners/11')
        .set('Authorization', `Bearer ${generateJwtToken(1)}`)

      expect(response.status).toBe(404)
    })
  })
})
