import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import { act } from 'react';


const  SearchItemsSlice = createSlice(
    {
        name: "searchItems",
        initialState:{
            suggestions:[]
        },
        reducers:{
            addSearchItems(state,action){
              state.suggestions.push(...action.payload)
            }
        }
    }
)
export const { addSearchItems } = SearchItemsSlice.actions;

export default SearchItemsSlice.reducer;