import React from 'react';
import * as htmlToImage from 'html-to-image';

const NavBar = ({ onSearch }) => {
  const handleDownload = async () => {
    const reactFlowWrapper = document.querySelector(".react-flow");
    if (!reactFlowWrapper) {
      alert("No visualization found to download!");
      return;
    }
    try {
      const dataUrl = await htmlToImage.toPng(reactFlowWrapper, {
        backgroundColor: "white",
        quality: 1.0,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "json_tree.png";
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };
  return (
    <nav className="w-full bg-white/60 backdrop-blur-md shadow-sm px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Logo and Title */}
        <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" 
     viewBox="0 0 24 24" 
     fill="#804000" 
     stroke="#804000" 
     stroke-width="1.1" 
     class="w-7 h-7">
  <path d="M5,3H7V5H5v5a2,2,0,0,1-2,2,2,2,0,0,1,2,2v5H7v2H5c-1.07-.27-2-.9-2-2V15a2,2,0,0,0-2-2H0V11H1A2,2,0,0,0,3,9V5A2,2,0,0,1,5,3M19,3a2,2,0,0,1,2,2V9a2,2,0,0,0,2,2h1v2H23a2,2,0,0,0-2,2v4a2,2,0,0,1-2,2H17V19h2V14a2,2,0,0,1,2-2,2,2,0,0,1-2-2V5H17V3h2M12,15a1,1,0,1,1-1,1,1,1,0,0,1,1-1M8,15a1,1,0,1,1-1,1,1,1,0,0,1,1-1m8,0a1,1,0,1,1-1,1A1,1,0,0,1,16,15Z"/>
</svg>

        <h1 className="text-xl font-bold text-gray-800">JSON Viewer</h1>
        </div>

        {/* Right: Search, Theme Toggle, and Download */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search nodes..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/80"
              onChange={(e) => onSearch(e.target.value)}
            />
            <svg
              className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Theme Toggle Button */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            title="Toggle theme"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </button>

          {/* Download Button */}
          <button onClick={handleDownload}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            title="Download JSON"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;