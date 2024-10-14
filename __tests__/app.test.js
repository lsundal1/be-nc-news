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
test('200 - sends a list of topics to the client', () => {
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then(({body}) => {
        expect(body.topics.length).toBe(3)
        expect
            body.topics.forEach(topic => {
                expect(typeof topic.description).toBe('string')
                expect(typeof topic.slug).toBe('string')
            })
        })
    })
})
describe('GET: 404 - bad request',() => {
    test('404 - returns 404 if endpoint does not exist', () => {
        return request(app)
        .get('/api/giraffes')
        .expect(404)
        .then((response) => {
            expect(response.res.statusMessage).toBe('Not Found')
        })
    })
})
describe('GET:/api', () => {
    test('200 - responds with an object detailing all available endpoints', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({body}) => {
                expect(body.endpoints).toEqual(endpoints)
            }) 
    })
})
describe('GET:/api/articles/:article_id', () => {
    test('200 - responds with an article when given a valid id',() => {
        return request(app)
            .get('/api/articles/4')
            .expect(200)
            .then(({body}) => {
                expect(body.article.title).toBe("Student SUES Mitch!")
                expect(body.article.topic).toBe("mitch")
                expect(body.article.author).toBe("rogersop")
                expect(typeof body.article.created_at).toBe('string') 
                expect(typeof body.article.article_img_url).toBe('string')
            })
    })
    test('404 - responds with 404 "article does not exist" when given a valid id that is not present',() => {
        return request(app)
            .get('/api/articles/999')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('article does not exist');
            })
    })
    test('400 - responds with 400 bad request when given a non-valid id',() => {
        return request(app)
            .get('/api/articles/scooby')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('bad request');
            })
    })
    test('404 - responds with 404 Not Found when given no id',() => {
        return request(app)
            .get('/api/articles')
            .expect(404)
            .then(({res}) => {
                expect(res.statusMessage).toBe('Not Found');
            })
    })
})