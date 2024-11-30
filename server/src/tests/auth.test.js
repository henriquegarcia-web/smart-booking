const request = require('supertest')
const app = require('../app')

describe('Auth Tests', () => {
  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password'
  }

  beforeAll(async () => {
    // Ensure the user does not exist before tests
    await request(app).post('/api/auth/register').send(userData)
  }, 10000) // Aumenta o tempo limite para 10 segundos

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'New User',
        email: 'new@example.com',
        password: 'password'
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('email', 'new@example.com')
  })

  it('should not register a user with existing email', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('code', 'REGISTRATION_FAILED')
  })

  it('should login a user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
  })

  it('should not login with incorrect password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' })

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('code', 'LOGIN_FAILED')
  })
})
