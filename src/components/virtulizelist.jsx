import React from 'react'

function virtulizelist({videos}) {
  return (
    <div className="grid gap-4 grid-cols-3 p-16">
        {videos.map((val, index) => (
          <VideoCard 
            key={`${val.id}-${index}`} // Better key using video ID
            val={val} 
            channelId={val.snippet.channelId}
            channelImage={channelImages == null ? "" : channelImages[val.snippet.channelId]} // Pass channel image directly
          />
        ))}
      </div>
  )
}

export default virtulizelist
