const request = require('supertest')

const app = require('../../src/app.js')
const truncate = require('../utils/truncate')
const factory = require('../factories')

describe('Authentication', () => {
  beforeEach(async () => await truncate())

  it('should authenticate with valid crendentials', async () => {
    const user = await factory.create('User', { password: '123123' })

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123123'
      })

    expect(response.status).toBe(200)
  })

  it('should authenticate with invalid crendentials', async () => {
    const user = await factory.create('User', { password: '123123' })

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123456'
      })

    expect(response.status).toBe(401)
  })

  it('should return jwt when authenticated', async () => {
    const user = await factory.create('User', { password: '123123' })

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123123'
      })

    expect(response.body).toHaveProperty('token')
  })

  it('should be able to access private routes when authenticated', async () => {
    const user = await factory.create('User', { password: '123123' })

    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${user.generateToken()}`)

    expect(response.status).toBe(200)
  })

  it('should not be able to access private routes whitout jwt', async () => {
    const response = await request(app).get('/dashboard')

    expect(response.status).toBe(401)
  })
  it('should not be able access private route with invalid jwt token', async () => {
    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', 'Bearer 123123')

    expect(response.status).toBe(401)
  })
})
