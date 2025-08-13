import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchBar from './searchbar';
const Navbar = () => {
  const [navVisible, setNavVisible] = useState(false);

  return (
    <div>
      <nav className='flex justify-between sm:gap-20 items-center bg-[#0d0d0d] text-sm sm:text-lg p-4 text-white'>
        {/* Left Section */}
        <div className={`${navVisible ? "hidden":"flex"} sm:block`}>
          <MenuIcon />
          <YouTubeIcon sx={{ color: "red",fontSize: {
      xs: 42, // default (mobile)
      sm: 32, // ≥640px
      md: 40, // ≥900px
    },}} className='ml-0.5 sm:ml-4' />
          <span className='text-xl'>YouTube</span>
        </div>

        {/* Search Input */}
        <div
          className={`${
            navVisible ? 'block' : 'hidden'
          } sm:block w-full sm:w-auto flex-1`}
        >
         <SearchBar></SearchBar>
        </div>

        {/* Search Icon (only on small screens) */}
        <div className='block sm:hidden'>
          <SearchIcon onClick={() => setNavVisible(!navVisible)} />
        </div>

        {/* Right Section */}
        <div className='hidden sm:flex items-center gap-4'>
          <button className='bg-[#272727] rounded-2xl py-1 px-4'>Create</button>
          <NotificationsIcon />
          <span>Signup</span>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

