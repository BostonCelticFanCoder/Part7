import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'users',
    initialState: {
        user: null,
        username: '',
        password: ''
    },
    reducers: {
        setCurrUser(state, action){
            return {...state, user: action.payload}
        },
        setCurrUsername(state, action){
            return {...state, username: action.payload}
        },
        setCurrPassword(state, action){
            return {...state, password: action.payload}
        },
    }
})

export const {setCurrUser, setCurrUsername, setCurrPassword} = userSlice.actions

export default userSlice.reducer