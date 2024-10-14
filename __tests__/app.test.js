const app = require('../app.js')
const request = require('supertest')
const db = require('../db/connection.js')
const seed = require('../db/seeds/seed.js')
const { articleData, topicData, userData, commentData } = require('../db/data/test-data/index.js')
const endpoints = require('../endpoints.json')

beforeEach(() => {
    return seed({ articleData, topicData, userData, commentData })
})
afterAll(() => {
    return db.end()
})

describe('GET:/api/topics', () => {
test('GET: 200 - sends a list of topics to the client', () => {
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then(({body}) => {
            expect(body.topics.forEach(topic => {
                expect(typeof topic.description).toBe('string')
                expect(typeof topic.slug).toBe('string')
            }))
        })
    })
    test('GET: 404 - returns 404 if endpoint does not exist', () => {
        return request(app)
        .get('/api/giraffes')
        .expect(404)
        .then((response) => {
            expect(response.res.statusMessage).toBe('Not Found')
        })
    })
})
describe('GET:/api', () => {
    test('GET:200 - responds with an object detailing all available endpoints', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({body}) => {
                expect(body.endpoints).toEqual(endpoints)
            }) 
    })
})