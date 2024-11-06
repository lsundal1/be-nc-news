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

describe('/api/topics', () => {
    describe('GET', () => {
        describe('/api/topics', () => {
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
            test('404 - returns 404 if endpoint does not exist', () => {
                return request(app)
                .get('/api/giraffes')
                .expect(404)
                .then(({res}) => {
                    expect(res.statusMessage).toBe('Not Found')
                })
            })
            test('404 - returns 404 if endpoint does not exist', () => {
                return request(app)
                .get('/api/giraffes')
                .expect(404)
                .then(({res}) => {
                    expect(res.statusMessage).toBe('Not Found')
                })
            })
        })
        describe('/api/topics/:topic_name', () => {
            test('200 - returns a single topic by topic name', () => {
                return request(app)
                .get('/api/topics/mitch')
                .expect(200)
                .then(({body}) => {
                    expect(body.topic.slug).toBe('mitch')
                    expect(body.topic.description).toBe('The man, the Mitch, the legend')
                })

            })
            test('404 - returns a single topic by topic name', () => {
                return request(app)
                .get('/api/topics/camel')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe('Topic does not exist')
                })
            })
        })
    })
})

describe('/api/articles', () => {
    describe('GET', () => {
        describe('/api/articles', () => {
            test('200 - responds with an array of all articles',() => {
                return request(app)
                    .get('/api/articles')
                    .expect(200)
                    .then(({body}) => {
                        expect(body.articles.length).toBe(13)
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
            test('404 - returns 404 if endpoint does not exist', () => {
                return request(app)
                .get('/api/giraffes')
                .expect(404)
                .then(({res}) => {
                    expect(res.statusMessage).toBe('Not Found')
                })
            })
            test('200 - sorts by column when provided with a valid column', () => {
                return request(app)
                    .get('/api/articles?sort_by=article_id')
                    .expect(200)
                    .then(({body}) => {
                        expect(body.articles).toBeSortedBy('article_id', { descending: true })
                    })
            })
            test('200 - sorts by column when provided with a valid column', () => {
                return request(app)
                    .get('/api/articles?sort_by=comment_count')
                    .expect(200)
                    .then(({body}) => {
                        console.log(body.articles)
                        expect(body.articles).toBeSortedBy('comment_count', { descending: true, coerce: true, })
                    })
            })
            test('200 - sorts by order when provided with a valid order', () => {
                return request(app)
                    .get('/api/articles?order=asc')
                    .expect(200)
                    .then(({body}) => {
                        expect(body.articles).toBeSortedBy('created_at', { ascending: true })
                    })
            })
            test('400 - provides 400 error when sort_by is not a valid column', () => {
                return request(app)
                    .get('/api/articles?sort_by=dinasours')
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).toBe('bad request')
                    })
            })
            test('400 - provides 400 error when order is not a valid order', () => {
                return request(app)
                    .get('/api/articles?order=alphabetically')
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).toBe('bad request')
                    })
            })
            test('200 - filters by topic when provided with a valid topic', () => {
                return request(app)
                    .get('/api/articles?topic=cats')
                    .expect(200)
                    .then(({body}) => {
                        expect(body.articles).toHaveLength(1)
                        body.articles.forEach(article => {
                            expect(article.topic).toBe('cats')
                        })
                    })
            })
            // empty array could mean that either: the topic does not exist,
            test('404 - responds with 404 not found when topic does not exist', () => {
                return request(app)
                    .get('/api/articles?topic=banana')
                    .expect(404)
                    .then(({body}) => {
                        expect(body.msg).toBe('Topic does not exist')
                    })
            })
            // or: the topic exists but there is no content
            test('200 - responds with 200 and empty array if topic exists but there are no articles associated', () => {
                return request(app)
                    .get('/api/articles?topic=paper')
                    .expect(200)
                    .then(({body}) => {
                        expect(body.articles).toHaveLength(0)
                        expect(body.articles).toEqual([])
                    })
            })
        })
        describe('/api/articles/:article_id', () => {
            test('200 - responds with an article when given a valid id',() => {
                return request(app)
                    .get('/api/articles/4')
                    .expect(200)
                    .then(({body}) => {
                        expect(body.article.article_id).toBe(4)
                        expect(body.article.title).toBe("Student SUES Mitch!")
                        expect(body.article.topic).toBe("mitch")
                        expect(body.article.body).toBe("We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages")
                        expect(body.article.author).toBe("rogersop")
                        expect(body.article.created_at).toBe('2020-05-06T01:14:00.000Z') 
                        expect(body.article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')

                    })
            })
            test('200 - includes a comment_count which is the total count of all the comments with this article_id',() => {
                return request(app)
                    .get('/api/articles/4')
                    .expect(200)
                    .then(({body}) => {
                        expect(body.article.article_id).toBe(4)
                        expect(body.article.title).toBe("Student SUES Mitch!")
                        expect(body.article.topic).toBe("mitch")
                        expect(body.article.author).toBe("rogersop")
                        expect(body.article.created_at).toBe('2020-05-06T01:14:00.000Z') 
                        expect(body.article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
                        expect(body.article.comment_count).toBe("0")

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
        describe('/api/articles/:article_id/comments', () => {
            test('200 - Responds with an array of comments for the given article_id', () => {
                return request(app)
                    .get('/api/articles/1/comments')
                    .expect(200)
                    .then(({body}) => {
                        expect(body.comments.length).toBe(11)
                        body.comments.forEach(comment => {
                            expect(comment).toMatchObject({
                                comment_id: expect.any(Number),
                                votes: expect.any(Number),
                                created_at: expect.any(String),
                                author: expect.any(String),
                                body: expect.any(String), 
                                article_id: 1
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
            test('404 - article_id is valid but does not exist', () => {
                return request(app)
                    .get('/api/articles/999/comments')
                    .expect(404)
                    .then(({body}) => {
                        expect(body.msg).toBe('article does not exist');
                    })
            })
            test('400 - Invalid article_id', () => {
                return request(app)
                    .get('/api/articles/hello/comments')
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).toBe('Invalid id type');
                    })
            })
        })
    })
    describe('POST', () => {
        describe('/api/articles', () => {
            test('200 - posts a new article', () => {
                return request(app)
                    .post('/api/articles')
                    .send({ author: 'icellusedkars', title: '30th', body: 'It\'s Lloyd\'s birthday!!', topic: 'mitch', article_img_url: 'https://www.southernliving.com/thmb/jT66ZLlTZCO1-jVxuNTEd5IyVYg=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-157182459-223227efb9bc46468fb7b9988f41ca39.jpg'})
                    .expect(200)
                    .then(({body}) => {
                        console.log(body.newArticle)
                        expect(body.newArticle).toMatchObject({
                            article_id: expect.any(Number),
                            author: expect.any(String),
                            title: expect.any(String),
                            article_id: expect.any(Number),
                            topic: expect.any(String),
                            created_at: expect.any(String), 
                            votes: 0,
                            article_img_url: expect.any(String)
                            // comment_count: 0
                        })
                    })
            })
        })
        describe('/api/articles/:article_id/comments', () => {
            test('200: - adds a comment for an article', () => {
                return request(app)
                    .post('/api/articles/4/comments')
                    .send({username: 'fairyGodMother123', body: "She's a princess, and you're an ogre. That's something no amount of potion is ever going to change."})
                    .expect(200)
                    .then(({body}) => {
                        const { newComment } = body
                        expect(newComment).toMatchObject({    
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String), 
                            article_id: expect.any(Number)       
                        })
                    })
            })
            test('404 - article_id is valid but does not exist', () => {
                return request(app)
                    .post('/api/articles/999/comments')
                    .send({username: 'fairyGodMother123', body: "She's a princess, and you're an ogre. That's something no amount of potion is ever going to change."})
                    .expect(404)
                    .then(({body}) => {
                        expect(body.msg).toBe('article does not exist');
                    })
            })
            test('400 - Invalid article_id', () => {
                return request(app)
                    .post('/api/articles/hello/comments')
                    .send({username: 'fairyGodMother123', body: "She's a princess, and you're an ogre. That's something no amount of potion is ever going to change."})
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).toBe('Invalid id type');
                    })
            })
            test('400 - bad request, body does not include correct properties', () => {
                return request(app)
                    .post('/api/articles/4/comments')
                    .send({})
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).toBe("bad request");
                    })
            })
            test('400 - bad request, body does not include correct properties', () => {
                return request(app)
                    .post('/api/articles/4/comments')
                    .send({username: 123, body: ['hello my name is']})
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).toBe("bad request");
                    })
            })
        })
    })
    describe('PATCH', () => {
        describe('/api/articles/:article_id', () => {
            test('200: - responds with an updated article', () => {
                return request(app)
                    .patch('/api/articles/4')
                    .send({ inc_votes : 1 })
                    .expect(200)
                    .then(({body}) => {
                        const { updatedArticle } = body
                        expect(updatedArticle.votes).toBe(1)
                    })
            })
            test('404 - responds with 404 "article does not exist" when given a valid id that is not present',() => {
                return request(app)
                    .patch('/api/articles/999')
                    .send({ inc_votes : 1 })
                    .expect(404)
                    .then((response) => {
                        expect(response.body.msg).toBe('article does not exist');
                    })
            })
            test('400 - responds with 400 bad request when given a non-valid id',() => {
                return request(app)
                    .patch('/api/articles/scooby')
                    .send({ inc_votes : 1 })
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).toBe('Invalid id type')
                    })
            })
            test('400 - bad request, body does not include correct properties', () => {
                return request(app)
                    .patch('/api/articles/4')
                    .send({})
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).toBe("bad request");
                    })
            })
            test('400 - bad request, body does not include correct properties', () => {
                return request(app)
                    .patch('/api/articles/4')
                    .send({ inc_votes : '1' })
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).toBe("bad request");
                    })
            })
        })
    })
})

describe('/api/comments', () => {
    describe('PATCH', () => {
        test('200 - updates the votes on a comment given the comment\'s comment_id', () => {
            return request(app)
                .patch('/api/comments/1')
                .send({ inc_votes: 4})
                .expect(200)
                .then(({body}) => {
                    expect(body.updatedComment.votes).toBe(20)
                })
        })
        test('404 - responds with 404 "article does not exist" when given a valid id that is not present',() => {
            return request(app)
                .patch('/api/comments/999')
                .send({ inc_votes : 1 })
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe('Comment does not exist');
                })
        })
        test('400 - responds with 400 bad request when given a non-valid id',() => {
            return request(app)
                .patch('/api/comments/scooby')
                .send({ inc_votes : 1 })
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe('Invalid id type')
                })
        })
        test('400 - bad request, body does not include correct properties', () => {
            return request(app)
                .patch('/api/comments/4')
                .send({})
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("bad request");
                })
        })
        test('400 - bad request, body does not include correct properties', () => {
            return request(app)
                .patch('/api/comments/4')
                .send({ inc_votes : '1' })
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("bad request");
                })
        })
    })
    describe('DELETE', () => {
        describe('/api/comments/:comment_id', () => {
            test('204: - deletes comment by comment_id', () => {
                return request(app)
                .delete('/api/comments/1')
                .expect(204)
                .then(({res}) => {
                    expect(res.statusMessage).toBe('No Content')
                })
            })
            test('404 - responds with 404 "Not found" when given a valid id that is not present',() => {
                return request(app)
                    .delete('/api/comments/999')
                    .expect(404)
                    .then(({body}) => {
                        expect(body.msg).toBe('Comment not found')
                    })
            })
            test('400 - responds with 400 bad request when given a non-valid id',() => {
                return request(app)
                    .delete('/api/comments/scooby')
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).toBe('Invalid id type')
                    })
            })
        })
    })
})

describe('/api/users', () => {
    describe('GET', () => {
        describe('/api/users', () => {
            test('200 - responds with an array of all users',() => {
                return request(app)
                    .get('/api/users')
                    .expect(200)
                    .then(({body}) => {
                        const { users } = body
                        expect(users.length).toBe(4)
                        users.forEach(user => {
                            expect(user).toMatchObject({
                            username: expect.any(String),
                            name: expect.any(String),
                            avatar_url: expect.any(String)
                        })
                    })
                })
            })
            test('404 - returns 404 if endpoint does not exist', () => {
                return request(app)
                .get('/api/giraffes')
                .expect(404)
                .then(({res}) => {
                    expect(res.statusMessage).toBe('Not Found')
                })
            })
        })
        describe('/api/users/:username', () => {
            test('200 - responds with an individual user when given a valid username', () => {
                return request(app)
                    .get('/api/users/rogersop')
                    .expect(200)
                    .then(({body}) => {
                        expect(body.user.username).toBe('rogersop')
                        expect(body.user.name).toBe('paul')
                        expect(body.user.avatar_url).toBe('https://avatars2.githubusercontent.com/u/24394918?s=400&v=4')
                    })
            })
            test('404 - responds with 404 "Username does not exist" when given a username that does not exist',() => {
                return request(app)
                    .get('/api/users/999')
                    .expect(404)
                    .then((response) => {
                        expect(response.body.msg).toBe('Username does not exist');
                    })
            })
        })
    })
})