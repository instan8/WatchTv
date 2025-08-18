import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
const key = import.meta.env.VITE_API_KEY;
export const fetchList=createAsyncThunk('fetchList',async (nextPageToken="")=>{
    let url=`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=IN&maxResults=21&key=${key}`;
    if (nextPageToken) {
      url += `&pageToken=${nextPageToken}`; // append token for next page
    }

      const res = await fetch(url);
    const data=await res.json();
    console.log("data0",data)
    console.log("datane",data.nextPageToken)
    return {"Items":data.items,"nextPageToken":data.nextPageToken}
})
const homeVideoSlice=createSlice({
name:"List",
initialState:{
    isLoading:false,
    data:null,
},
extraReducers:(builder)=>{
    builder.addCase(fetchList.pending,(state,action)=>{
        state.isLoading=true;
    }).addCase(fetchList.fulfilled,(state,action)=>{
        console.log("action",action.payload)
        state.isLoading=false;
        
        if (state?.data && state.data?.Items) {
        state.data = {"Items":[...state.data.Items, ...action.payload.Items],"nextPageToken":action.payload.nextPageToken};
        
    } else {
        state.data = action.payload;
    }
    }).addCase(fetchList.rejected,(state,action)=>{
        console.log("error")
    })

}
})


export default homeVideoSlice.reducer;

