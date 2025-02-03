import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/10 shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-white hover:text-gray-300">
              Dev Compare
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-4">
            <Link
              to="/codeforces"
              className="text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Codeforces
            </Link>
            <Link
              to="/leetcode"
              className="text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              LeetCode
            </Link>
            <Link
              to="/codechef"
              className="text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              CodeChef
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;