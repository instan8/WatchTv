// pages/VideoPage.jsx
import React, { use, useEffect, useMemo ,useState} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import YouTubePlayer from '../components/YouTubePlayer';
import { fetchRelatedVideo, deleteVideo } from '../utils/slices/relatedVideoSlice';
import { useDispatch, useSelector } from 'react-redux'
import { fetchChannelImage } from '../utils/slices/chanelImageSlic'
import VideoCard from '../components/videoCard'
import CommentSection from '../components/CommentSection';
import Profile from '../components/profile';
const VideoPage = () => {
  const dispatch = useDispatch();
  const {data,isLoading} =useSelector((store) => {
    console.log(store.fetchRelatedVideo,"sot")
    return store.fetchRelatedVideo});
  const relatedVidoesLoading=isLoading
  
  const [comments, setComments] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [specificVideo, setSpecificVideo] = useState({});
  const [commentLoading, setCommentLoading] = useState(false);
  const [specificDataLoading, setSpecificDataLoading] = useState(false);
    const { search } = useLocation();
  const query = new URLSearchParams(search);
  const catId = query.get("cat");
  console.log(catId,"catId")
  const videoId = query.get('id');

  const fetchSpecificVideo = async(videoId)=>{
  console.log("videoId", videoId)
  const specificVideo=  await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=AIzaSyB8RcykCgS5K8xAoDeFJ_2gAwFmxlvMoYc`);
  const specificVideoData = await specificVideo.json();
setSpecificDataLoading(false);
  console.log("specificv",specificVideoData)
  return specificVideoData.items[0];
}

   async function fetchComments(videoId) {
    let url =`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=10&key=AIzaSyB8RcykCgS5K8xAoDeFJ_2gAwFmxlvMoYc`;
    if(nextPageToken){
      url+=`&pageToken=${nextPageToken}`
    }
  const response = await fetch(
    url)
  const data = await response.json();

  console.log(data,"comment");
  return data
}

const loadSpecificData = async () => {
    const specificVideoData = await fetchSpecificVideo(videoId);
    setSpecificVideo(specificVideoData);
  };
const loadCommentData = async () => {

   console.log(commentLoading, "commentLoading");
    const commentData = await fetchComments(videoId);
    console.log(commentLoading, "commentLoading");
     setNextPageToken(commentData?.nextPageToken)
    setCommentLoading(false)
    if(!comments || comments.length === 0) {
    setComments(commentData.items);

    }
    else{
      setComments((prevComments) => [...prevComments, ...commentData.items]);
    }
       
  };

  
 


  //
// 'id' should be a YouTube video ID
useEffect(() => {
  let timeoutId = null;

  const handleScroll = () => {
    if (timeoutId !== null) return;

    timeoutId = setTimeout(() => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 100 && !commentLoading) {
        if(!commentLoading){
          setCommentLoading(true);
          console.log("Loading more comments...");
           loadCommentData();
        }
        
         // prevent double loading
        //  if(!relatedVidoesLoading)
       
        // dispatch(fetchRelatedVideo(catId));
      }

      timeoutId = null;
    }, 300); // Throttle time
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [commentLoading, videoId]);
  useEffect(() => {
    
      loadSpecificData();
      loadCommentData();
      dispatch(fetchRelatedVideo(catId))
    console.log("useeffect 2")
 

  }, []);


  return (
   
   <div className=" flex w-full flex-col sm:flex-row gap-10 bg-black">
  {/* LEFT SIDE - Video + Profile + Comments */}
  <div className="w-full sm:min-w-[60%] flex flex-col">
    <YouTubePlayer videoId={videoId} />
    <Profile val={specificVideo} />

    {/* On mobile, related videos will be shown here before comments */}
    <section className="block sm:hidden mb-4">
      {data.length > 0
        ? data.map((video) => (
            <VideoCard key={video.id} val={video} />
          ))
        : "data"}
    </section>

    <CommentSection comments={comments} />
  </div>

  {/* RIGHT SIDE - Related videos (hidden on mobile) */}
  <section className="hidden sm:block sm:w-[35%] flex-1 mt-26 mr-8">
    {data.length > 0
      ? data.map((video) => (
          <VideoCard key={video.id} val={video} />
        ))
      : "data"}
  </section>
</div>

 
     
 
  );
};

export default VideoPage;
