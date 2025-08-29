import { configureStore } from "@reduxjs/toolkit";
import fetchHomList from '../slices/Slice'
import fetchChannelImage from '../slices/chanelImageSlic'
import  fetchRelatedVideoReducer from "../slices/relatedVideoSlice";
import searchItems from '../slices/serchItems'
import suggestionBox from '../slices/suggestionbox'

export const store=configureStore({
    reducer:{
        "fetchHomeList":fetchHomList,
        "fetchChannelImage":fetchChannelImage,
        "fetchRelatedVideo":fetchRelatedVideoReducer,
       "searchItems":searchItems,
       "suggestionBox":suggestionBox
    }
})