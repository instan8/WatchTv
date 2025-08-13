// main.jsx or main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app'; // ensure this path is correct
import './index.css';    // your Tailwind or global CSS
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 
   <BrowserRouter>
    <App />
    </BrowserRouter>
 

);
