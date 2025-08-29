import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchList } from '../utils/slices/Slice';
import { fetchChannelImage } from '../utils/slices/chanelImageSlic';
import VideoCard from '../components/videoCard';
import VirtualizedList from '../components/virtulizelist';
import { toggleSuggestionBox } from '../utils/slices/suggestionbox';
export default function Home() {
  const dispatch = useDispatch();
  
  const containerRef = useRef(null);
  const isLoadingRef = useRef(false); // Ref to track loading state
  const nextPageTokenRef = useRef(null); // ADD THIS - you're missing this ref!
  const channelImageIsLoadingRef = useRef(false); // Ref to track channel images
  const data = useSelector(state => state.fetchHomeList.data);
  const isLoading = useSelector(state => state.fetchHomeList.isLoading);
  const channelImages = useSelector(state => state.fetchChannelImage.data);
  const channelImageLoading = useSelector(state => state.fetchChannelImage.isLoading);
  const channelIdsRef=useRef([]);
  console.log("chanelidref",channelIdsRef.current)
  console.log(channelImages, "channelImages in home");
  console.log(data, "datahome");
  
  const videos = data?.Items || [];
  const nextPageToken = data?.nextPageToken;
  console.log("Next Page Token:", nextPageToken);
  console.log("videos",videos)
  // Update ref when loading state changes
  console.log("ref",channelImageLoading)
    const channelIds = [...new Set(videos.map(video => video.snippet.channelId))];
  
  channelIdsRef.current = channelIds;
  let filterChannelId = [];
  if(channelIdsRef.current.length > 0){
   filterChannelId = channelIdsRef.current.filter(id => !(id in channelImages));}
  // Extract unique channel IDs from current videos using useMemo for performance

  console.log(channelIds, "channelIds in home");
  useEffect(() => {
  channelImageIsLoadingRef.current = channelImageLoading;
  }, [channelImageLoading]);
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);
  
  // ADD THIS - Update nextPageTokenRef when token changes
  useEffect(() => {
    nextPageTokenRef.current = nextPageToken;
    console.log("Updated nextPageTokenRef to:", nextPageToken);
  }, [nextPageToken]);
  
  

  
  useEffect(() => {
    if (!data) {
      dispatch(fetchList());
    }
  }, []);
  
  // Batch fetch channel images when videos change
  // useEffect(() => {
  //   console.log("useeffect channelIds", channelIds);
  //   if (channelIds.length > 0) {
  //     dispatch(fetchChannelImage(filterChannelId));
  //   }
  // }, [channelIds,]);
  useEffect(() => {
  if (filterChannelId.length > 0) {
    dispatch(fetchChannelImage(filterChannelId));
  }
}, [filterChannelId, dispatch]);
  
  // SOLUTION 1: Use useCallback with proper dependencies and refs
  
  // SOLUTION 3: Debounced scroll handler (recommended)
  const debounceTimeoutRef = useRef(null);
  
  const debouncedHandleScroll = () => {
    console.log("Scroll triggered!"); // Add this for debugging
    
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      console.log("Debounced scroll executing!"); // Add this for debugging
      console.log("isLoading:", isLoadingRef.current);
      console.log("nextPageToken:", nextPageTokenRef.current);
      if(channelImageIsLoadingRef.current){
        console.log("Skipping - channel images are loading");
        return;
      }
      if (isLoadingRef.current  ) {
        console.log("Skipping - currently loading");
        return;
      }
      
      const threshold = 200;
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.body.offsetHeight;
      
      console.log("Scroll position:", scrollPosition);
      console.log("Document height - threshold:", documentHeight - threshold);
      
      if (scrollPosition >= documentHeight - threshold && nextPageTokenRef.current) {
        console.log("Dispatching fetchList with token:", nextPageTokenRef.current);
        dispatch(fetchList(nextPageTokenRef.current));
      } else {
        console.log("Scroll condition not met");
      }
    }, 100); // 100ms debounce
  };
  
  useEffect(() => {
    // Choose one of the solutions above
    window.addEventListener('scroll', debouncedHandleScroll); // Using debounced version
    
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      // Clear timeout on cleanup
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [debouncedHandleScroll,nextPageToken]);
  
  if (isLoading && videos.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="overflow-y-auto p-4  bg-black" ref={containerRef} onClick={()=>{dispatch(toggleSuggestionBox(false))}}> 
      
   
     <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 p-0 sm:p-16">
        {videos.map((val, index) => (
          <VideoCard 
            key={`${val.id}-${index}`} // Better key using video ID
            val={val} 
            channelId={val.snippet.channelId}
            channelImage={channelImages ? channelImages[val.snippet.channelId]:""} // Pass channel image directly
          />
        ))}
      </div>
      {isLoading && <div className="text-center mt-4">Loading more...</div>}
    </div>
    
  );
}