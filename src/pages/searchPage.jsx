import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { formatCompactNumber } from '../utils/viewsCount';
import { diffTime } from '../videoPostingTime';
import { fetchChannelImage } from '../utils/slices/chanelImageSlic';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
function searchPage() {
  const dispatch = useDispatch();
  const channelImage = useSelector(state => state.fetchChannelImage.data);
  console.log(channelImage, "chanelimage in searchpage")
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const keyword = query.get("q");
  console.log(keyword, "keyword");
  const [video, setVideos] = useState(null)
  console.log(video, "video in searchpage");
  useEffect(() => {
    const fetchSearchResults = async () => {
      const url = `https://www.googleapis.com/youtube/v3/search
?part=snippet
&type=video
&maxResults=10
&order=viewCount
&q=${encodeURIComponent(keyword).replace(/%20/g, "+")}
&regionCode=IN
&key=AIzaSyB8RcykCgS5K8xAoDeFJ_2gAwFmxlvMoYc
`;






      try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data, "searchdata");
        const channelIds = data.items.map(
          item => item.snippet.channelId
        );
        const videoIds = data.items.map(
          item => item.id.videoId
        );
        console.log(videoIds, "videoIds");
        const res2 = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(',')}&key=AIzaSyB8RcykCgS5K8xAoDeFJ_2gAwFmxlvMoYc`);
        const data2 = await res2.json();
        console.log(data2,"data2 in se")
         setVideos(data2.items)
        dispatch(fetchChannelImage(channelIds))

        

       


        console.log(data, "searchdata");
      }
      catch (err) {
        console.error("Error fetching search results:", err);
      }
    }
    fetchSearchResults();
  }, [keyword])
  return (
    <>
      <div className='px-0 sm:px-20 w-screen text-white'>
        {video?.length > 0 && video.map(val => {
          return (
            <Link to={`/watch?id=${val.id}&cat=${val.snippet.categoryId }`}>
              <div className='block sm:flex rounded mb-2 mt-2 w-full'>
                <img className='left-part sm:rounded-2xl w-[100%]  h-60 sm:h-auto sm:max-w-[50%]' src={val.snippet.thumbnails.medium.url} alt={val.snippet.title} />
                <div className='ml-4 right-part'>
                  <h3 className='text-lg font-semibold'>{val.snippet.title}</h3>
                  <div className='flex gap-2'>
                    <p className='text-sm'> {diffTime(val.snippet.publishedAt)}.</p>
                    <p className='text-sm'>{formatCompactNumber(val.statistics.viewCount)}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <img referrerpolicy="no-referrer" className="size-6 rounded-full" src={channelImage?.[val.snippet.channelId]?.channelImage
                      || "image"
                    } alt={"image"}></img>
                    <p className='text-sm'>{channelImage?.[val.snippet.channelId]?.channelName || "loading.."}</p>
                  </div>
                  <p className='truncate w-80  overflow-hidden text-sm text-gray-600'>{val.snippet.description}</p>
                </div>

              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default searchPage
