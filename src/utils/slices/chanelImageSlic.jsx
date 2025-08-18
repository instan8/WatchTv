import {createSlice,createAsyncThunk, isPending, isFulfilled} from '@reduxjs/toolkit';
const key = import.meta.env.VITE_API_KEY;
export const fetchChannelImage=createAsyncThunk("fetchChannelImage",
    async (ids)=>{
 console.log("channelimageworking")
 console.log(ids, "ids in fetchChannelImage");

    const results = {};

    
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${ids.join(",")}&key=${key}`
      );
      const val = await response.json();
      console.log(val, "val in fetchChannelImage");

      val.items.forEach((item) => {
        results[item.id] = {
          channelName: item.snippet.title,
          channelImage: item.snippet.thumbnails.high.url,
          channelDescription: item.snippet.description,
        };
      });
    
 console.log(results, "results in fetchChannelImage");
    return results;
  }
)
const channelImage=createSlice({
    name:"channelImage",
    initialState:{
        isLoading:false,
    data:{},
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchChannelImage.pending,(state,action)=>{
            state.isLoading=true;
        })
        builder.addCase(fetchChannelImage.fulfilled,(state,action)=>{
            state.isLoading=false;
           
  if (Object.keys(state.data).length > 0) {
    // Merge with existing data
    state.data = { ...state.data, ...action.payload };
  } else {
    // Replace entirely if empty
    state.data = action.payload;
  }
        })
    }
})

export default channelImage.reducer;