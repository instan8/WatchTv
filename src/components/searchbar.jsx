import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';
import { Link } from 'react-router-dom';
import { addSearchItems } from '../utils/slices/serchItems';

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async (searchTerm) => {
    if (!searchTerm) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
          `https://suggestionserver.onrender.com/api/suggestions?q=${encodeURIComponent(searchTerm)}`

      );
      const data = await res.json();
   console.log(data,"searchdata");
      if (data) {
        
        setSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useRef(
    debounce((val) => fetchSuggestions(val), 300)
  ).current;

  useEffect(() => {
    debouncedFetch(query);
    return () => debouncedFetch.cancel();
  }, [query]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    setShowDropdown(true);
  };

  const handleSelect = (value) => {
    setQuery(value);
    setShowDropdown(false);
    
  };

  return (
    <div className="relative w-full   ">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search YouTube..."
        className="w-full h-8 p-3 border border-gray-300 rounded-full  shadow-sm focus:outline-none"
      />
      {showDropdown && query && (
        <ul className="absolute z-10 w-full  border mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto flex flex-col ">
          {loading && (
            <li className="p-2 bg-amber-200 text-gray-500 text-sm">Loading...</li>
          )}
          {!loading &&
            suggestions.map((sug, idx) => (
              <Link to={`/serchpage?q=${encodeURIComponent(sug).replace(/%20/g, '+')}`}
                key={idx}
                onClick={() => handleSelect(sug)}
                className="p-3 bg-gray-800 hover:bg-gray-800 cursor-pointer text-sm "
              >
                {sug}
              </Link>
            ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
