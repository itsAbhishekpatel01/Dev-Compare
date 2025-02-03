import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 font-sans text-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 animate-fade-in">
          Coding Profile Analyzer & Comparator
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl animate-fade-in-up">
          Visualize your coding profiles and compare them with your friends to track your progress and improve your skills. Supported platforms: Codeforces, LeetCode, and CodeChef.
        </p>
        <Link
          to="/codeforces"
          className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform transition-transform hover:scale-105 animate-bounce-in"
        >
          Get Started
        </Link>
      </div>

      {/* Features Section */}
      <div className="bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-700 p-8 rounded-lg shadow-lg hover:shadow-xl transform transition-transform hover:scale-105">
              <h3 className="text-2xl font-semibold mb-4">Profile Visualization</h3>
              <p className="text-gray-300">
                View detailed statistics and insights about your coding profiles on Codeforces, LeetCode, and CodeChef.
              </p>
            </div>
            <div className="bg-gray-700 p-8 rounded-lg shadow-lg hover:shadow-xl transform transition-transform hover:scale-105">
              <h3 className="text-2xl font-semibold mb-4">Profile Comparison</h3>
              <p className="text-gray-300">
                Compare your coding profiles with your friends to see how you stack up and identify areas for improvement.
              </p>
            </div>
            <div className="bg-gray-700 p-8 rounded-lg shadow-lg hover:shadow-xl transform transition-transform hover:scale-105">
              <h3 className="text-2xl font-semibold mb-4">Multi-Platform Support</h3>
              <p className="text-gray-300">
                Supports Codeforces, LeetCode, and CodeChef, so you can analyze and compare profiles across multiple platforms.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Supported Platforms Section */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            Supported Platforms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transform transition-transform hover:scale-105">
              <h3 className="text-2xl font-semibold mb-4 text-center">Codeforces</h3>
              <p className="text-gray-300 text-center">
                Analyze and compare Codeforces profiles to track your competitive programming progress.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transform transition-transform hover:scale-105">
              <h3 className="text-2xl font-semibold mb-4 text-center">LeetCode</h3>
              <p className="text-gray-300 text-center">
                Visualize your LeetCode profile and compare it with others to improve your problem-solving skills.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transform transition-transform hover:scale-105">
              <h3 className="text-2xl font-semibold mb-4 text-center">CodeChef</h3>
              <p className="text-gray-300 text-center">
                Track your CodeChef profile and compare it with friends to stay ahead in coding challenges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;