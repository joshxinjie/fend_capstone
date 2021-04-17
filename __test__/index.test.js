const app = require('../src/server/index') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

it('Testing /test endpoint', async done => {
    const response = await request.get('/test')
    expect(response.status).toBe(200) // check if request was successfull
    expect(response.body).toBeDefined(); // check if response returned value of projecteData
    return done();
})