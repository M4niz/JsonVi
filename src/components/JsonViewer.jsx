import React, { useState } from 'react';
import NavBar from './common/NavBar';
import TreeVisualizer from "./TreeVisualizer";

const JsonViewer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jsonText, setJsonText] = useState(`{
  "name": "John Doe",
  "age": 30,
  "email": "john.doe@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001"
  },
  "hobbies": ["reading", "traveling", "swimming"]
}`);
  const [isValid, setIsValid] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [visualizedData, setVisualizedData] = useState(null);
  const [searchMessage, setSearchMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const handleChange = (e) => {
    const value = e.target.value;
    setJsonText(value);
    try {
      JSON.parse(value);
      setIsValid(true);
      setErrorMsg('');
    } catch (err) {
      setIsValid(false);
      setErrorMsg(err.message);
    }
  };

  const handleVisualize = () => {
    setVisualizedData(jsonText);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query?.trim()) setSearchMessage('');
  };

  const handleMatchResult = (matched) => {
    if (matched === null) {
      setSearchMessage('');
      return;
    }
    setSearchMessage(matched ? 'Match found' : 'No match found');
    setTimeout(() => setSearchMessage(''), 2500);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
    isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
  }`}>
      <NavBar onSearch={handleSearch} onToggleTheme={toggleTheme} isDarkMode={isDarkMode}/>
      <div
  className={`px-4 py-2 text-center font-semibold border-b transition-all duration-500
    ${searchMessage
      ? (searchMessage.includes('Match')
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 opacity-100'
          : 'bg-rose-50 text-rose-800 border-rose-200 opacity-100')
      : 'opacity-0 border-transparent'}`}
  style={{ minHeight: '2.5rem' }}
>
  {searchMessage || ''}
</div>

      <main className="mx-auto items-center max-w-7x2 p-5">
        <div className="grid grid-cols-12 gap-5">
          {/* Left card */}
          <section className={`col-span-12 lg:col-span-5 rounded-xl border shadow-sm transition-colors duration-300 ${
    isDarkMode
      ? 'bg-gray-900 border-gray-700'
      : 'bg-white border-neutral-200'
  }`}>
            <div className="p-5">
              <h3 className={`mb-3 text-lg font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-gray-100' : 'text-neutral-800'
              }`}>JSON Input</h3>
              <textarea
                value={jsonText}
                onChange={handleChange}
                className={`w-full h-[60vh] font-mono text-sm p-3 rounded-md outline-none transition
                ${isValid ? 'border border-neutral-300 focus:ring-2 focus:ring-blue-300' : 'border-2 border-rose-500'}`}
              />
              {!isValid && (
                <div className="text-rose-600 mt-2 text-xs">Error: {errorMsg}</div>
              )}
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={handleVisualize}
                  disabled={!isValid}
                  className={`px-4 py-2 rounded-md text-white text-sm font-medium transition cursor-pointer
                  ${isValid ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800' : 'bg-neutral-400 cursor-not-allowed'}`}
                >
                  Visualize as Tree
                </button>
                <span
                  className={`px-2.5 py-1 rounded text-xs font-semibold border
                  ${isValid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}
                >
                  {isValid ? 'Valid JSON' : 'Invalid JSON'}
                </span>
              </div>
            </div>
          </section>

          {/* Right card */}
          <section className={`w-[950px] rounded-xl border shadow-sm transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-neutral-200'
          }`}>
            <div className="p-5">
              <h3 className={`mb-3 text-lg font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-gray-100' : 'text-neutral-800'
              }`}>Tree Visualization</h3>
              {visualizedData ? (
                <TreeVisualizer
                  jsonData={visualizedData}
                  searchQuery={searchQuery}
                  onMatchResult={handleMatchResult}
                  isDarkMode={isDarkMode}
                />
              ) : (
                <div className="text-center mt-12 text-neutral-500">
                  Click "Visualize as Tree" to see the graph
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default JsonViewer;
