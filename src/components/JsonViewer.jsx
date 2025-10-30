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
    // TODO: Implement search functionality
  };

  return (
    <div className="min-h-screen graph-paper-background animate-background">
      <NavBar onSearch={handleSearch} />
      <div className="p-6 flex gap-6">
        {/* Left Card (Input Section) */}
  <div className="w-[35%] bg-white/80 backdrop-blur-lg border border-white border-opacity-30 rounded-lg p-6 shadow-lg">
  {/*<span className="flex flex-col items-start mt-3 py-2 px-6 font-semibold">JSON</span>*/}
    <textarea
      className="w-full h-[800px] p-4 border border-gray-300 rounded-lg mb-4 font-mono text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/80 resize-none"
      value={jsonText}
      onChange={handleChange}
      placeholder=''
    />
    <div className="flex flex-col items-center mt-3">
      <button
        className="py-2 px-6 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-800 transition disabled:opacity-50 cursor-pointer"
        disabled={!isValid}
        onClick={handleVisualize}
      >
        Visualize as Tree
      </button>

      <div className="mt-2 font-bold">
        {isValid === null ? (
          <span className="text-gray-500">Waiting for input...</span>
        ) : isValid ? (
          <span className="text-green-600">Valid JSON</span>
        ) : (
          <span className="text-red-600">Invalid JSON</span>
        )}
      </div>
    </div>
  </div>

  {/* Right Card (Visualization Section) */}
  <div className="flex-1 bg-white/80 backdrop-blur-lg border border-white border-opacity-30 rounded-lg p-6 shadow-lg">
    {/* Replace this placeholder with your visualizer */}
    <div className="text-gray-700 text-center font-medium">
      <TreeVisualizer jsonData={visualizedData} />
    </div>
  </div>
</div>
    </div>
  );
};

export default JsonViewer;