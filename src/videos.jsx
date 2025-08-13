import React, { useEffect, useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { fetchList } from './utils/slices/Slice';
function Video() {
  
  const dispatch =useDispatch();
  const data=useSelector(state=>state.fetchHomeList)
 console.log(data,"data")
  useEffect(( ) => {
    console.log("Hii")
   dispatch(fetchList())
  }, []);

  return (
    <div>
   
    </div>
  );
}

export default Video;
