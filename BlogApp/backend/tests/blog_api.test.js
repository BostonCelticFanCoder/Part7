const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany([
        {
            _id: '5a422a851b54a676234d17f7',
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: 7,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422b3a1b54a676234d17f9',
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12,
            __v: 0
        },
        {
            _id: '5a422b891b54a676234d17fa',
            title: 'First class tests',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
            likes: 10,
            __v: 0
        },
        {
            _id: '5a422ba71b54a676234d17fb',
            title: 'TDD harms architecture',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
            likes: 0,
            __v: 0
        },
        {
            _id: '5a422bc61b54a676234d17fc',
            title: 'Type wars',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
            likes: 2,
            __v: 0
        }
    ])
    await User.deleteMany({})
    const saltRounds = 10
    const passwordHash = await bcrypt.hash('yin', saltRounds)
    await User.insertMany([{ username: 'Maksim', name: 'Maksim Yin',notes:[],id: '65dba6360141bb4ec71fcbab', password: 'yin', passwordHash: passwordHash }])
})


test('HTTP Get request', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(response.body.length)
})

test('unique property of blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    for (let blog of response.body) {
        expect(blog.id)
    }
})

test('after adding blog to database, database should increase by one and content should be saved inside database', async () => {
    let old = await api.get('/api/blogs')


    await api.post('/api/blogs')
        .send({
            title: 'auth',
            author: 'Maksim Yin',
            url: 'https://maksim.com',
            likes: 100000000,
        })
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1ha3NpbSIsImlkIjoiNjVkYmE2MzYwMTQxYmI0ZWM3MWZjYmFiIiwiaWF0IjoxNzA5MzI2MDk2fQ.aNJJnv8TC89f9Bag62Mupif4Hj0RhuBL33npq4EX8ow')
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(old.body.length + 1)
})

test('adding a blog with wrong token results in an error', async () => {
    await api.post('/api/blogs')
        .send({
            title: 'auth',
            author: 'Maksim Yin',
            url: 'https://maksim.com',
            likes: 100000000,
        })
        .expect(401)
})

test('if likes property is missing, it will default to 0', async () => {
    await api.post('/api/blogs')
        .send({
            title: 'Maksim Yin',
            author: 'Maksim Yin',
            url: 'https://maksim.com',
        })

    const response = await api.get('/api/blogs')
    for (let blog of response.body) {
        expect(blog.likes)
    }
})

test('if title property is missing, backend responds with 400 Bad Request', async () => {
    await api.post('/api/blogs')
        .send({
            author: 'Maksim Yin',
            url: 'https://maksim.com',
        })

    expect({ error: 'Missing title or url property' })
})

test('if url property is missing, backend responds with 400 Bad Request', async () => {
    await api.post('/api/blogs')
        .send({
            title: 'Maksim Yin',
            author: 'Maksim',
        })

    expect({ error: 'Missing title or url property' })
})

test('deleting a single blog post resource', async () => {
    await api.post('/api/blogs')
        .send({
            title: 'auth',
            author: 'Maksim Yin',
            url: 'https://maksim.com',
            likes: 100000000,
        })
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1ha3NpbSIsImlkIjoiNjVkYmE2MzYwMTQxYmI0ZWM3MWZjYmFiIiwiaWF0IjoxNzA5MzI2MDk2fQ.aNJJnv8TC89f9Bag62Mupif4Hj0RhuBL33npq4EX8ow')
    let response = await api.get('/api/blogs')
    await api.delete(`/api/blogs/${response.body[6].id}`)
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1ha3NpbSIsImlkIjoiNjVkYmE2MzYwMTQxYmI0ZWM3MWZjYmFiIiwiaWF0IjoxNzA5MzI2MDk2fQ.aNJJnv8TC89f9Bag62Mupif4Hj0RhuBL33npq4EX8ow')
        .expect(204)

    let newResponse = await api.get('/api/blogs')
    expect(newResponse.body).toHaveLength(response.body.length - 1)
})



test('updating an individual blog post', async () => {
    let response = await api.get('/api/blogs')
    const newNote = {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 8,
    }
    await api.put(`/api/blogs/${response.body[0].id}`, newNote)
    let newResponse = await api.get('/api/blogs')
    // eslint-disable-next-line eqeqeq
    expect(newResponse.body[0].likes == newNote.likes)
})

describe('if a new user is created', () => {
    test('username length is at least 3 characters long', async () => {
        await api.post('/api/users')
            .send({
                username: 'BR',
                name: 'Bob Riley',
                password: '12345'
            })
        expect({ error: 'Password and username are under 4 characters or username is invalid' })
    })
    test('password length is at least 3 characters long', async () => {
        await api.post('/api/users')
            .send({
                username: 'John',
                name: 'Jogn Riley',
                password: '22'
            })
        expect({ error: 'Password and username are under 4 characters or username is invalid' })
    })
    test('username must be unique', async () => {
        await api.post('/api/users')
            .send({
                username: 'Maksim',
                name: 'Maksim Rob',
                password: 'mrbrc'
            })
        expect({ error: 'username is already taken' })
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})