import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchList } from '../utils/Slice';
import { fetchChannelImage } from '../utils/chanelImageSlic';
import VideoCard from '../components/videoCard';

export default function Home() {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const isLoadingRef = useRef(false); // Ref to track loading state
  
  const data = useSelector(state => state.fetchHomeList.data);
  const isLoading = useSelector(state => state.fetchHomeList.isLoading);
  const channelImages = useSelector(state => state.fetchChannelImage.data);
  
  console.log(channelImages, "channelImages in home");
  console.log(data, "datahome");
  
  const videos = data?.Items || [];
  const nextPageToken = data?.nextPageToken;
  console.log("Next Page Token:", nextPageToken);
  
  // Update ref when loading state changes
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);
  
  // Extract unique channel IDs from current videos using useMemo for performance
  const channelIds = useMemo(() => {
    return [...new Set(videos.map(video => video.snippet.channelId))];
  }, [videos]);
  
  console.log(channelIds, "channelIds in home");
  
  useEffect(() => {
    console.log("useeffect mounted");
    return () => {
      console.log("useeffect unmounted");
    };
  }, []);
  
  useEffect(() => {
    if (!data) {
      dispatch(fetchList());
    }
  }, [data, dispatch]);
  
  // Batch fetch channel images when videos change
  useEffect(() => {
    console.log("useeffect channelIds", channelIds);
    if (channelIds.length > 0) {
      dispatch(fetchChannelImage(channelIds));
    }
  }, [channelIds, dispatch]);
  
  // SOLUTION 1: Use useCallback with proper dependencies and refs
  // const handleScroll = useCallback(() => {
  //   // Prevent multiple simultaneous requests
  //   if (isLoadingRef.current) return;
    
  //   const threshold = 50;
  //   const scrollPosition = window.innerHeight + window.scrollY;
  //   const documentHeight = document.body.offsetHeight;
    
  //   if (scrollPosition >= documentHeight - threshold) {
  //     // Get fresh nextPageToken from current state
  //     const currentState = store.getState(); // You'll need to pass store or use a ref
  //     const currentNextPageToken = currentState.fetchHomeList.data?.nextPageToken;
      
  //     if (currentNextPageToken) {
  //       dispatch(fetchList(currentNextPageToken));
  //     }
  //   }
  // }, [dispatch]);
  
  // SOLUTION 2: Alternative approach using useRef for nextPageToken
  // const nextPageTokenRef = useRef(nextPageToken);
  
  // useEffect(() => {
  //   nextPageTokenRef.current = nextPageToken;
  // }, [nextPageToken]);
  

  
  // SOLUTION 3: Debounced scroll handler (recommended)
  const debounceTimeoutRef = useRef(null);
  
  const debouncedHandleScroll = useCallback(() => {
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
      
      if (isLoadingRef.current) {
        console.log("Skipping - currently loading");
        return;
      }
      
      const threshold = 50;
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
  }, [dispatch]);
  
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
  }, [debouncedHandleScroll]);
  
  if (isLoading && videos.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="overflow-y-auto p-4 bg-red-300" ref={containerRef}>
      <div className="grid gap-4 grid-cols-4 p-16 bg-amber-300">
        {videos.map((val, index) => (
          <VideoCard 
            key={`${val.id}-${index}`} // Better key using video ID
            val={val} 
            channelId={val.snippet.channelId}
            channelImage={channelImages == null ? "" : channelImages[val.snippet.channelId]} // Pass channel image directly
          />
        ))}
      </div>
      {isLoading && <div className="text-center mt-4">Loading more...</div>}
    </div>
  );
}

// new code
import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchList } from '../utils/Slice';
import { fetchChannelImage } from '../utils/chanelImageSlic';
import VideoCard from '../components/videoCard';

export default function Home() {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const isLoadingRef = useRef(false); // Ref to track loading state
  const nextPageTokenRef = useRef(null); // ADD THIS - you're missing this ref!
  
  const data = useSelector(state => state.fetchHomeList.data);
  const isLoading = useSelector(state => state.fetchHomeList.isLoading);
  const channelImages = useSelector(state => state.fetchChannelImage.data);
  
  console.log(channelImages, "channelImages in home");
  console.log(data, "datahome");
  
  const videos = data?.Items || [];
  const nextPageToken = data?.nextPageToken;
  console.log("Next Page Token:", nextPageToken);
  
  // Update ref when loading state changes
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);
  
  // ADD THIS - Update nextPageTokenRef when token changes
  useEffect(() => {
    nextPageTokenRef.current = nextPageToken;
    console.log("Updated nextPageTokenRef to:", nextPageToken);
  }, [nextPageToken]);
  
  // Extract unique channel IDs from current videos using useMemo for performance
  const channelIds = useMemo(() => {
    return [...new Set(videos.map(video => video.snippet.channelId))];
  }, [videos]);
  
  console.log(channelIds, "channelIds in home");
  
  useEffect(() => {
    console.log("useeffect mounted");
    return () => {
      console.log("useeffect unmounted");
    };
  }, []);
  
  useEffect(() => {
    if (!data) {
      dispatch(fetchList());
    }
  }, [data, dispatch]);
  
  // Batch fetch channel images when videos change
  useEffect(() => {
    console.log("useeffect channelIds", channelIds);
    if (channelIds.length > 0) {
      dispatch(fetchChannelImage(channelIds));
    }
  }, [channelIds, dispatch]);
  
  // SOLUTION 1: Use useCallback with proper dependencies and refs
  
  // SOLUTION 3: Debounced scroll handler (recommended)
  const debounceTimeoutRef = useRef(null);

  const debouncedHandleScroll = useCallback(() => {
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
      
      if (isLoadingRef.current) {
        console.log("Skipping - currently loading");
        return;
      }
      
      const threshold = 50;
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
  }, [dispatch]);
  
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
  }, [debouncedHandleScroll]);
  
  if (isLoading && videos.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="overflow-y-auto p-4 bg-red-300" ref={containerRef}>
      <div className="grid gap-4 grid-cols-4 p-16 bg-amber-300">
        {videos.map((val, index) => (
          <VideoCard 
            key={`${val.id}-${index}`} // Better key using video ID
            val={val} 
            channelId={val.snippet.channelId}
            channelImage={channelImages == null ? "" : channelImages[val.snippet.channelId]} // Pass channel image directly
          />
        ))}
      </div>
      {isLoading && <div className="text-center mt-4">Loading more...</div>}
    </div>
  );
}