import { generateJwtToken, testRequest } from '../setup'

describe('Partner Invitations E2E', () => {
  describe('Invite', () => {
    it('should return 403 if partner not authorized', async () => {
      const response = await testRequest()
        .post('/partners/invite')
        .set('Authorization', `Bearer ${generateJwtToken(1)}`)
        .send({
          partnerId: 555,
          email: 'test3@test.com',
        })

      expect(response.status).toBe(403)
    })
    it('should return 404 if user not found', async () => {
      const response = await testRequest()
        .post('/partners/invite')
        .set('Authorization', `Bearer ${generateJwtToken(1)}`)
        .send({
          partnerId: 10,
          email: 'test345@test.com',
        })

      expect(response.status).toBe(404)
    })

    it('should return 201 if pass', async () => {
      const response = await testRequest()
        .post('/partners/invite')
        .set('Authorization', `Bearer ${generateJwtToken(1)}`)
        .send({
          partnerId: 10,
          email: 'test3@test.com',
        })

      expect(response.status).toBe(201)
    })
  })

  describe('Get Invitations', () => {
    it('should return 404 if invitations not found', async () => {
      const response = await testRequest()
        .get('/partners/invite')
        .set('Authorization', `Bearer ${generateJwtToken(1)}`)

      expect(response.status).toBe(404)
    })

    it('should return 200 if there are invitations', async () => {
      const response = await testRequest()
        .get('/partners/invite?status=pending')
        .set('Authorization', `Bearer ${generateJwtToken(3)}`)

      expect(response.status).toBe(200)
    })
  })

  describe('Respond to invitation', () => {
    it('should return 404 if invitation not found', async () => {
      const response = await testRequest()
        .post('/partners/invite/response')
        .set('Authorization', `Bearer ${generateJwtToken(1)}`)
        .send({
          partnerId: 5,
          isAccepted: false,
        })

      expect(response.status).toBe(404)
    })

    it('should return 201 if pass', async () => {
      const response = await testRequest()
        .post('/partners/invite/response')
        .set('Authorization', `Bearer ${generateJwtToken(3)}`)
        .send({
          partnerId: 10,
          isAccepted: false,
        })

      expect(response.status).toBe(201)
    })
  })
})
