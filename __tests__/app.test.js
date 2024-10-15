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

describe('GET: 404 - bad request',() => {
    test('404 - returns 404 if endpoint does not exist', () => {
        return request(app)
        .get('/api/giraffes')
        .expect(404)
        .then(({res}) => {
            expect(res.statusMessage).toBe('Not Found')
        })
    })
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

describe('GET:/api/articles', () => {
    describe('GET:/api/articles', () => {
        test('200 - responds with an array of all articles',() => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({body}) => {
                    body.articles.forEach(article => {
                        expect(article).toMatchObject({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String), 
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(String)
                    })
                })
            })
        })
        test('200 - articles are ordered by date descending by default', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({body}) => {
                    expect(body.articles).toBeSortedBy('created_at', { descending: true });
                })
        })
        test('200 - there should be no body property present on any of the articles', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({body}) => {
                    body.articles.forEach(article => {
                        expect(!article.body).toBe(true)
                    })
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
                .then(({body}) => {
                    expect(body.msg).toBe('Invalid id type')
                })
        })
    })
    describe('GET:/api/articles/:article_id/comments', () => {
        test('200 - Responds with an array of comments for the given article_id', () => {
            return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({body}) => {
                    body.comments.forEach(comment => {
                        expect(comment).toMatchObject({
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String), 
                            article_id: expect.any(Number),
                        })
                    })
                })
        })
        test('200 - comments should be served with the most recent comments first', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({body}) => {
                    expect(body.comments).toBeSortedBy('created_at', { descending: true });
                })
        })
        test('200 - returns an empty array when a valid article_id is provided but there are no associated comments', () => {
            return request(app)
                .get('/api/articles/4/comments')
                .expect(200)
                .then(({body}) => {
                    expect(body.comments).toHaveLength(0)
                })
        })
        test('404 - Category id is valid but does not exist', () => {
            return request(app)
                .get('/api/articles/999/comments')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe('article does not exist');
                })
        })
        test('400 - Invalid category_id', () => {
            return request(app)
                .get('/api/articles/hello/comments')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe('Invalid id type');
                })
        })
    })
})