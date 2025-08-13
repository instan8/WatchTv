import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchList } from '../utils/Slice';
import { fetchChannelImage } from '../utils/chanelImageSlic';
import VideoCard from '../components/videoCard';

export default function Home() {
  const dispatch = useDispatch();
const nextPageTokenRef = useRef(null);
   const containerRef = useRef(null);
  const isLoadingRef = useRef(false); 
  const data = useSelector(state => state.fetchHomeList.data);
  const isLoading = useSelector(state => state.fetchHomeList.isLoading);
  const channelImages = useSelector(state => state.fetchChannelImage.data);
  console.log(channelImages, "channelImages in home");
  console.log(data, "datahome");
  
  const videos = data?.Items || [];
  const nextPageToken = data?.nextPageToken;
  console.log("Next Page Token:", nextPageToken);
  
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
  }, []);

  // Batch fetch channel images when videos change
  useEffect(() => {
    console.log("useeffect channelIds", channelIds);
    if (channelIds.length > 0) {
      dispatch(fetchChannelImage(channelIds));
    }
  }, [channelIds]);
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (
  //       (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) && !isLoading && nextPageToken
  //     ) {
  //       dispatch(fetchList(nextPageToken)); // Trigger your content load
  //     }
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, [nextPageToken]);
 const debounceTimeoutRef = useRef(null);
  
  const debouncedHandleScroll = useCallback(() => {
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      if (isLoadingRef.current) return;
      
      const threshold = 50;
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.body.offsetHeight;
      
      if (scrollPosition >= documentHeight - threshold && nextPageTokenRef.current) {
        dispatch(fetchList(nextPageTokenRef.current));
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
  

  // const handleScroll = useCallback(() => {
  //   const container = containerRef.current;
  //   if (!container || isLoading) return;

  //   const { scrollTop, scrollHeight, clientHeight } = container;
  //   const threshold = 100;

  //   if (scrollTop + clientHeight >= scrollHeight - threshold && nextPageToken) {
  //     dispatch(fetchList(nextPageToken));
  //   }
  // }, [dispatch, isLoading, nextPageToken]);

  // useEffect(() => {
  //   const container = containerRef.current;
  //   if (!container) return;

  //   container.addEventListener('scroll', handleScroll);
  //   return () => container.removeEventListener('scroll', handleScroll);
  // }, [handleScroll]);
if (isLoading && videos.length === 0) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-2xl">Loading...</div>
    </div>
  );
}
  return (
    <div  className="overflow-y-auto  p-4 bg-red-300 " ref={containerRef}>
      <div className="grid gap-4 grid-cols-4 p-16 bg-amber-300">
        {videos.map((val, index) => (
          <VideoCard 
            key={`${val.id}-${index}`} // Better key using video ID
            val={val} 
            channelId={val.snippet.channelId}
            channelImage={channelImages == null ?" ":channelImages[val.snippet.channelId]} // Pass channel image directly
          />
        ))}
      </div>
      {isLoading && <div className="text-center mt-4">Loading more...</div>}
    </div>
  );
}
