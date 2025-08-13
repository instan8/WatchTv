import React from 'react'

import { content } from './sidebarContent';
function sidebar() {
  return (
    <div className='bg-black w-[15%]'>
      {
        content.map(val =>{

            return (<div className='sm:text-lg mb-2 border-b-1 border-white text-white'>  
            <span>{val[1]}</span>
            <span>{val[0]}</span>
            </div>)
        })
      }
    </div>
  )
}

export default sidebar
