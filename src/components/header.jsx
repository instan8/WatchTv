import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import SearchBar from './searchbar';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleSuggestionBox } from '../utils/slices/suggestionbox';
const Navbar = () => {
  const [navVisible, setNavVisible] = useState(false);
const dispatch=useDispatch();
  return (
    <div onClick={()=>{dispatch(toggleSuggestionBox(false))}}>
      <nav className='flex justify-between sm:gap-20 items-center bg-[#0d0d0d] text-sm sm:text-lg p-4 text-white'>
        {/* Left Section */}
        <Link to={"/"}>   
        <div className={`${navVisible ? "hidden":"flex"} sm:flex items-center`}>
          
          <YouTubeIcon sx={{ color: "red",fontSize: {
      xs: 42, // default (mobile)
      sm: 32, // ≥640px
      md: 40, // ≥900px
    },}} className='ml-0.5 sm:ml-4' />
          <div className='text-xl'>YouTube</div>
        </div>
        </Link>

        {/* Search Input */}
        <div
          className={`${
            navVisible ? 'block' : 'hidden'
          } sm:block w-full sm:w-auto flex-1`}
        >
         <SearchBar></SearchBar>
        </div>

        {/* Search Icon (only on small screens) */}
        <div className='block sm:hidden'>{
          navVisible?<CloseIcon onClick={()=>setNavVisible(!navVisible)}/> : <SearchIcon onClick={() => setNavVisible(!navVisible)} />
          }
         
        </div>

        {/* Right Section */}
        <div className='hidden sm:flex items-center gap-4 cursor-pointer'>
          <button className='bg-[#272727] rounded-2xl py-1 px-4 hover:bg-red-600 cursor-pointer'>Create</button>
          <NotificationsIcon />
          <span className='hover:bg-red-600 rounded-2xl'>Signup</span>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

