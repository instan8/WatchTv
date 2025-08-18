
import React from 'react';
import { Link } from 'react-router-dom';
import { diffTime } from '../videoPostingTime';
import { formatCompactNumber } from '../utils/viewsCount';
function VideoCard({ val,  channelImage }) {
  console.log(val, "val in videocard");
  console.log(channelImage,"channelimage  in card")

  return (
    <Link to={`/watch?id=${val.id}&cat=${val.snippet.categoryId ? val.snippet.categoryId : val.catId}`}>
      <div className='h-70 sm:h-auto  w-full mb-4 flex flex-col rounded-md text-white
      '>
        <img
          src={`https://img.youtube.com/vi/${val.id}/maxresdefault.jpg`}
          alt={val.snippet.title}
          className='w-full object-cover overflow-hidden h-40 grow-2 rounded-md mb-2'
          loading="lazy"
           referrerpolicy="no-referrer" // Add lazy loading
        />
        <section className='flex gap-1'>

          <img
          referrerpolicy="no-referrer"
            src={channelImage?.channelImage || '/default-channel-avatar.png'}
            alt={channelImage?.channelTitle || 'Channel Avatar'}
            className='w-6 h-6  object-cover rounded-full translate-y-1'
            loading="lazy"
          />

          <div className='min-w-0  flex flex-col'>
            <p className='text-lg font-medium truncate mb-4'>
              {val.snippet.title}
            </p>
            <p className='text-sm'>
              {val.snippet.channelTitle}
            </p>
            <div>   
            <span className='text-sm mr-2'>
              {formatCompactNumber(val.statistics.viewCount)}
            </span>
            <span className='text-sm  '>
              {diffTime(val.snippet.publishedAt)}
            </span>
            </div>
          </div>
        </section>
      </div>
    </Link>
  );
}

export default VideoCard;