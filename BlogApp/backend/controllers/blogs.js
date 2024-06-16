const blogRouter = require('express').Router()
const { response } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')


blogRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)

})

blogRouter.post('/', async (request, response) => {
    const user = request.user

    if (!user) {
        return response.status(401).json({ error: 'token invalid' })
    }

    let blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes,
        user: user,
        comments: []
    })

    if (!blog.likes) {
        blog.likes = 0
    } else if (!blog.url || !blog.title) {
        response.json.status(400).json({ error: 'Missing title or url property' })
    }

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)
    if (user.id.toString() !== blog.user.toString()) {
        return response.status(401).json({ error: 'you must create the blog you want to delete' })
    }
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})


blogRouter.put('/:id', async (request, response) => {
    const user = await User.findById(request.body.user.id) 
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, {
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes,
        user: user,
        comments: request.body.comments,
        id: request.body.id
    }, { new: true })
    response.json(updatedBlog)
})


module.exports = blogRouter