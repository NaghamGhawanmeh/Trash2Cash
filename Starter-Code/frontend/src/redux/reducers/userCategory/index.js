//create reducer
import { createSlice } from "@reduxjs/toolkit";

export const CurrentCategory = createSlice({
    name: "currentCategory",
    initialState:{
        currentCategory :{},
    },
    reducers :{
        setCurrentCategory:(state,action)=>{
            console.log(action.payload);   
            state.currentCategory = action.payload
        } 
    }
})


export const {setCurrentCategory} = CurrentCategory.actions;
export default CurrentCategory.reducer