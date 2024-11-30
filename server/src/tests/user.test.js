const request = require('supertest')
const app = require('../app')

describe('User Tests', () => {
  let token

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' })

    token = loginResponse.body.token
  }, 10000) // Aumenta o tempo limite para 10 segundos

  it('should get user profile', async () => {
    const response = await request(app)
      .get('/api/user/profile')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('email', 'test@example.com')
  })

  it('should not get profile without token', async () => {
    const response = await request(app).get('/api/user/profile')

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('code', 'ACCESS_DENIED')
  })
})
