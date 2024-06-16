const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const unique = await User.find({ username })
    if (username.length < 4 && password.length < 4) {
        return response.status(400).json({ error: 'Password and username are under 4 characters or username is invalid' })
    } else if (unique.length > 0) {
        return response.status(400).json({ error: 'username is already taken' })
    }

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.status(200).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
    response.json(users)
})

module.exports = usersRouter