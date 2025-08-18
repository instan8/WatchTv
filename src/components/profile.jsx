import React ,{useEffect,useState} from 'react'
import { formatCompactNumber } from '../utils/viewsCount';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
const key = import.meta.env.VITE_API_KEY;
function profile({ val }) {
    const [channelImage, setChannelImage] = useState(null);
    const [subscribeCount,setSubscribeCount] = useState(null);

    const[isClicked,setIsClicked]= useState(false);
    const[isLiked,setIsLiked]= useState(false);
    const[isDisliked,setIsDisliked]= useState(false);
    console.log(val, "profile value");
    const channelId = val?.snippet?.channelId || "";
    console.log(channelId, "channelId");
    useEffect(
        ()=>{
            const fetchChannelImage = async(channelId)=>{
                const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${key}`);
                const data = await response.json();
                setChannelImage(data.items[0].snippet.thumbnails.default.url);
                setSubscribeCount(data.items[0].statistics.subscriberCount);
                console.log(data, "channelImageData");
               
            }
            if(channelId){
            fetchChannelImage(channelId)}
        },[channelId]
    )
    console.log("value for ", val)
    return (
        <div className='w-full mt-4 flex flex-col sm:flex-row gap-2 sm:gap-10 mb-6'>
 <div className='left-section w-[100%] sm:w-[50%] flex justify-around gap-2  text-lg'>
<img className="size-12 rounded-full" src={channelImage||null} alt="img"></img>
<div className='text-white'> <p className='w-40 truncate font-bold'>{val?.snippet?.channelTitle || "ChannelName"}</p>
<p className='text-sm'>{subscribeCount?formatCompactNumber(subscribeCount):"0"}<span>  subscriber</span></p> </div>
<button onClick={()=>{console.log("hello");setIsClicked(!isClicked)}} className={`${isClicked ?"bg-red-700":"bg-white"} cursor-pointer text-black text-sm px-2  py-1 rounded-full h-10`}>{isClicked?"unSubscribe":"subscribe"}</button>

 </div>
 <div className='right-section px-6'>
 <ThumbUpIcon sx={{
    fontSize: { xs: 24, sm: 32, md: 40 },
marginRight:"10px",
    color:isLiked?"red":"white"}
 } onClick={()=>{console.log("Hello") ; 
    if(!isDisliked){
    setIsLiked(!isLiked)

 }}} className='cursor-pointer '></ThumbUpIcon>
 <span className='text-white  text-lg mr-4'>{formatCompactNumber(val?.statistics?.likeCount || 0)}</span> 
 <ThumbDownAltIcon sx={{
    fontSize: { xs: 24, sm: 32, md: 40 },
 color:isDisliked?"red":"white"} } className="cursor-pointer"  onClick={()=>
 { if(!isLiked){
    setIsDisliked(!isDisliked)}}} ></ThumbDownAltIcon>
 </div>

           
        </div>
    )
}

export default profile
