import {createSlice} from '@reduxjs/toolkit'

import blogService from '../services/blogs'
import { handleNotification } from './notificationReducer'

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        addBlog(state, action) {
            state.push(action.payload)
        },
        setBlogs(state, action){
            return action.payload
        },
        removeBlogs(state,action) {
            return state.filter(element => element.id !== action.payload.id)
        }
    }
})

export const {addBlog, setBlogs, removeBlogs} = blogSlice.actions

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogService.getAll()
        dispatch(setBlogs(blogs))
    }
}

export const createNewBlog = (blog) => {
    return async dispatch => {
        let newBlog = await blogService.create(blog);
        dispatch(addBlog(newBlog));
        dispatch(handleNotification(`a new blog ${blog.title} by ${blog.author} added`));

    }
}

export const deleteBlog = (blog) => {
    return async dispatch => {
        await blogService.remove(blog);
        dispatch(removeBlogs(blog))
    }
}

export const updateBlogs = (newBlog, id, oldBlog) => {
    return async dispatch => {
        await blogService.update(newBlog, id)
        dispatch(removeBlogs(oldBlog))
        dispatch(addBlog(newBlog))
    }
}

export default blogSlice.reducer
