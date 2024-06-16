const jwt = require('jsonwebtoken')
const User = require('../models/user')



const userExtractor = async (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        let token = authorization.replace('Bearer ', '')

        const decodedToken = jwt.verify(token, process.env.SECRET).id
        const user = await User.findById(decodedToken)
        request.user = user
    }
    next()
}


module.exports = {
    userExtractor
}