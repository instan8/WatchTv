// app.jsx
import React, { lazy, Suspense } from 'react';
import Header from './components/header';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './utils/Store/HomePageListStore';
import VideoPlayer from './pages/VideoPlayer';
import Home from './pages/Home';

// Lazy load SearchPage so it only loads when visited
const SearchPage = lazy(() => import('./pages/searchPage'));

function App() {
  return (
    <Provider store={store}>
      <div className="text-3xl text-red-500">
        <Header />
        
          
            <Suspense fallback={<div className="text-white">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/watch" element={<VideoPlayer />} />
                <Route path="/serchpage" element={<SearchPage />} />
              </Routes>
            </Suspense>
           
      </div>
    </Provider>
  );
}

export default App;

      