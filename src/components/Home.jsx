import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-200 to-gray-300 font-sans">
      <h1 className="text-3xl  font-bold text-center mt-8 mb-6 text-gray-800 shadow-md">
        Profile Analyzer
      </h1>
      <div className="flex gap-4">
        <Link to="/codeforces">
          <button className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600">
            Codeforces Profile Compare
          </button>
        </Link>
        <Link to="/leetcode">
          <button className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
            LeetCode Profile Compare
          </button>
        </Link>
        <Link to="/codechef">
          <button className="bg-pink-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
            CodeChef Profile Compare
          </button>
        </Link>
        {/* <Link to="/testing">
          <button className="bg-teal-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
            Testing
          </button>
        </Link> */}
      </div>
    </div>
  );
};

export default Home;
