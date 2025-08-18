import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const key = import.meta.env.VITE_API_KEY;
export const fetchRelatedVideo = createAsyncThunk(
  "fetchRelatedVideo",
  async (catId) => {
    console.log("fetching related video", catId);

    // First fetch videos by category
    const relatedVideoRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&videoCategoryId=${catId}&maxResults=8&key=${key}`
    );
    const relVideoData = await relatedVideoRes.json();

    console.log("related video data", relVideoData);

    const videoIds = relVideoData.items.map(video => video.id).join(",");
    if (!videoIds) {
      return { items: [], nextPageToken: relVideoData?.nextPageToken || null };
    }

    // Fetch stats for those videos
    const videoStatsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${key}`
    );
    const statsData = await videoStatsRes.json();

    console.log("video stats", statsData);

    return {
      items: statsData.items,
      nextPageToken: relVideoData?.nextPageToken || null
    };
  }
);

const relatedVideoSlice = createSlice({
  name: "relatedVideo",
  initialState: {
    isLoading: false,
    data: [],
    nextPageToken: null
  },
  reducers: {
    deleteVideo(state) {
      state.data = [];
      state.nextPageToken = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRelatedVideo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRelatedVideo.fulfilled, (state, action) => {
        state.isLoading = false;
       
          state.data = action.payload.items;
        
        state.nextPageToken = action.payload.nextPageToken;
      });
  }
});

export default relatedVideoSlice.reducer;
export const { deleteVideo } = relatedVideoSlice.actions;
