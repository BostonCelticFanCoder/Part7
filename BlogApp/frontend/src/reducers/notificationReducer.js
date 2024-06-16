import {createSlice, current} from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: '',
    reducers: {
        createNotification(state, action) {
            return action.payload
        },
        removeNotification() {
            return null
        }
    }
})

export const {createNotification, removeNotification} = notificationSlice.actions

export const handleNotification = (content) => {
    return async dispatch => {
        dispatch(createNotification(content))
        setTimeout(() => {
            dispatch(removeNotification())
        }, 5000)
    }
}

export default notificationSlice.reducer