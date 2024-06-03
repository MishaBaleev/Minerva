import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const appSlice = createSlice({
    name: "app",
    initialState: {
        start_config:{
            int: "",
            crit_level: 20,
            is_detect_act: false
        },
        is_con: false,
        is_rec: false,
        start_config433:{
            int: "",
            is_detect_act: false
        },
        is_con433: false,
        is_rec433: false,
        is_test433: false,
        start_configMult:{
            int: ""
        },
        is_conMult: false,
        is_recMult: false
    },
    reducers: {
        setStartCon: (state, action) => {
            state.start_config[action.payload.key] = action.payload.value
        },
        setCon: (state, action) => {
            state.is_con = action.payload
        },
        setRec: (state, action) => {
            state.is_rec = action.payload
        },
        setStartCon433: (state, action) => {
            state.start_config433[action.payload.key] = action.payload.value
        },
        setCon433: (state, action) => {
            state.is_con433 = action.payload
        },
        setRec433: (state, action) => {
            state.is_rec433 = action.payload
        },
        setStartConMult: (state, action) => {
            state.start_configMult[action.payload.key] = action.payload.value
        },
        setConMult: (state, action) => {
            state.is_conMult = action.payload
        },
        setRecMult: (state, action) => {
            state.is_recMult = action.payload
        },
        setTest: (state, action) => {
            state.is_test = action.payload
        }
    }
})
export const {setStartCon, setCon, setRec, setStartCon433, setCon433, setRec433, setTest, setStartConMult, setConMult, setRecMult} = appSlice.actions 
export default appSlice.reducer