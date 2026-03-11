import React, { useState } from "react";

function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="w-full h-20 flex items-center justify-between px-10 
     bg-gradient-to-br from-[#4d4d4a] to-[#000000] relative">

      {/* Logo */}
      <div className="text-[#A89A84] text-3xl italic font-bold">
        News Bias Detector
      </div>

      {/* Nav Links */}
      <div className="flex items-center gap-10 relative font-bold">

        <a href="#" className="text-[#A89A84] hover:text-gray-600">
          Home
        </a>

        {/* Analyze News Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleMenu("analyze")}
            className="flex items-center gap-1 text-[#A89A84] hover:text-gray-600"
          >
            Analyze News
            <span
              className={`transition-transform ${
                openMenu === "analyze" ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {openMenu === "analyze" && (
            <div className="absolute top-10 left-0 w-48 bg-white shadow-lg rounded-lg border z-50">
              <ul className="text-sm">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Analyze News
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Bias Report
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Insights
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Methodology
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Bias Insights Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleMenu("insights")}
            className="flex items-center gap-1 text-[#A89A84] hover:text-gray-600"
          >
            Bias Insights
            <span
              className={`transition-transform ${
                openMenu === "insights" ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {openMenu === "insights" && (
            <div className="absolute top-10 left-0 w-48 bg-white shadow-lg rounded-lg border z-50">
              <ul className="text-sm">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Trends
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Reports
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Case Studies
                </li>
              </ul>
            </div>
          )}
        </div>

        <a href="#" className="text-[#A89A84] hover:text-gray-600">
          How It Works
        </a>

        <a href="#" className="text-[#A89A84] hover:text-gray-600">
          About
        </a>

        <a href="#" className="text-[#A89A84] hover:text-gray-600">
          Journal
        </a>

      </div>
    </div>
  );
}

export default Navbar;