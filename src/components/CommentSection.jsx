import React from 'react'
import { useEffect, useMemo ,useState} from 'react'
function CommentSection({comments}) {

    
  return (
    <div className='text-white mt-16'>
      <h1 className='mb-4'>Comments....</h1>
      {
        comments.map(comment=>{
        return  (<> 
        <div className='text-white mb-1 flex gap-4' key={comment.id}>
            <img className='size-6 rounded-full' referrerpolicy="no-referrer" src={comment.snippet.topLevelComment.snippet.
authorProfileImageUrl
} alt="User profile image" />
      <p className='text-sm'>{comment.snippet.topLevelComment.snippet.textDisplay}</p>
    

            </div>
            <hr className='mb-4'></hr></>)
})
      }
    </div> 
  )
}
 
export default CommentSection
