import { createSlice
 } from "@reduxjs/toolkit";

 const suggestionBoxSlice = createSlice({
    name: "suggestionBox",
    initialState:{
        suggestion:false
    }
    ,
    reducers:{
        toggleSuggestionBox:(state,parm)=>{
            state.suggestion = parm.payload
        }
    }
 })

 export const {toggleSuggestionBox} = suggestionBoxSlice.actions;
 export default suggestionBoxSlice.reducer;