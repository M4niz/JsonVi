import React from "react";
import * as htmlToImage from "html-to-image";

const NavBar = ({ onSearch, onToggleTheme, isDarkMode }) => {
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
    <header className={`sticky top-0 z-10 backdrop-blur border-b transition-colors duration-300 ${
    isDarkMode
      ? 'bg-gray-900/80 border-gray-700'
      : 'bg-white/80 border-neutral-200'
  }`}>
      <div className={`mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-6 ${
    isDarkMode ? 'text-gray-100' : 'text-neutral-800'
  }`}>
        {/* Left: Logo + Title */}
        <div className={`flex items-center gap-2 shrink-0 ${
          isDarkMode ? 'text-gray-100' : 'text-neutral-800'
          }`}>
          <div className="w-7 rounded bg-amber-100 text-amber-700 grid place-items-center font-bold">
            {`{}`}
          </div>
          <span
          className={`text-sm sm:text-base font-semibold transition-colors duration-300 ${
          isDarkMode ? 'text-gray-100' : 'text-neutral-800'
          }`}
          >
              JSON Viewer
          </span>
            </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-xl mx-6">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-neutral-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 21l-4.2-4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search JSONPath (e.g., $.name or address.city)"
              onChange={(e) => onSearch?.(e.target.value)}
              className={`w-full pl-10 pr-3 py-2 rounded-md border outline-none text-sm transition-colors duration-200
    ${isDarkMode
      ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400'
      : 'bg-white/90 border-neutral-300 text-gray-900 placeholder-neutral-400 focus:ring-2 focus:ring-blue-300'
    }`}
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className={`h-9 w-9 grid place-items-center rounded-md border ${
              isDarkMode
                ? 'border-gray-700 text-yellow-400 hover:bg-gray-800'
                : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'
            } cursor-pointer transition-colors`}
            title="Toggle theme"
          >
            {isDarkMode ? (
              //Light mode
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2M19 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
              </svg>
            ) : (
              //Dark mode
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className={`h-9 px-3 rounded-md border border-neutral-300 hover:bg-neutral-40 cursor-pointer font-semibold ${isDarkMode ? 'text-gray-100' : 'text-neutral-800'}`}
            title="Download image"
          >
            <span className="inline-flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 3v12m0 0l4-4m-4 4l-4-4M4 21h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Download
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
