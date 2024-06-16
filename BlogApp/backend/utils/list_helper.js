// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let totalLikes = 0
    // eslint-disable-next-line eqeqeq
    if (blogs == []){
        return 0
    } else if (blogs.length === undefined){
        return blogs.likes
    }
    blogs.forEach(blog => {
        totalLikes += blog.likes
    })
    return totalLikes
}

const favoriteBlog = (blogs) => {
    // eslint-disable-next-line eqeqeq
    if (blogs == []){
        return 0
    } else if (blogs.length === undefined){
        return blogs.likes
    }
    let topLikes = { 'title': '', 'author': '', likes: 0 }
    blogs.forEach(blog => {
        if (blog.likes > topLikes.likes){
            topLikes.likes = blog.likes
            topLikes.title = blog.title
            topLikes.author = blog.author
        }
    })
    return topLikes
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
}