import React from "react";
import { Link } from "react-router-dom";
import { Code2, Trophy, Award } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900/30 backdrop-blur-lg border-b border-gray-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 hover:opacity-80 transition-opacity"
            >
              Profile Analyzer
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            <Link
              to="/codeforces"
              className="flex items-center space-x-2 text-gray-300 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-700/50 transition-all duration-300 hover:text-indigo-400 hover:shadow-lg hover:shadow-indigo-500/20"
            >
              <Trophy size={18} />
              <span>Codeforces</span>
            </Link>
            <Link
              to="/leetcode"
              className="flex items-center space-x-2 text-gray-300 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-700/50 transition-all duration-300 hover:text-indigo-400 hover:shadow-lg hover:shadow-indigo-500/20"
            >
              <Code2 size={18} />
              <span>LeetCode</span>
            </Link>
            <Link
              to="/codechef"
              className="flex items-center space-x-2 text-gray-300 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-700/50 transition-all duration-300 hover:text-indigo-400 hover:shadow-lg hover:shadow-indigo-500/20"
            >
              <Award size={18} />
              <span>CodeChef</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;