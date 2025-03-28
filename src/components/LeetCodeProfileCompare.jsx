import React, { useState } from "react";
import { Search, Trophy, Code2, Brain, Swords, Crown, Github, Linkedin } from "lucide-react";

const LeetCodeProfileAnalyzer = () => {
  const [handle1, setHandle1] = useState("");
  const [handle2, setHandle2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user1, setUser1] = useState(null);
  const [user2, setUser2] = useState(null);

  const fetchUserData = async () => {
    if (!handle1 || !handle2) {
      setError("Please enter both user handles");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const [response1, response2] = await Promise.all([
        fetch(`https://leetcode-api-faisalshohag.vercel.app/${handle1}`),
        fetch(`https://leetcode-api-faisalshohag.vercel.app/${handle2}`)
      ]);
      
      const [data1, data2] = await Promise.all([
        response1.json(),
        response2.json()
      ]);
      
      setUser1(data1);
      setUser2(data2);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred || LeetCode Server Down");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value1, value2, icon: Icon }) => (
    <div className="bg-gray-800 rounded-xl  p-6 shadow-lg transform hover:scale-105 transition-transform duration-300 border border-gray-700 hover:border-indigo-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
        <Icon className="text-indigo-400" size={24} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-400">{handle1}</p>
          <p className="text-2xl font-bold text-indigo-400">{value1 || '-'}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">{handle2}</p>
          <p className="text-2xl font-bold text-indigo-400">{value2 || '-'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4">
            LeetCode Profile Analyzer
          </h1>
          <p className="text-lg text-gray-300">Compare LeetCode profiles and track your progress</p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-gray-800 rounded-2xl shadow-xl p-6 space-y-6 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  value={handle1}
                  onChange={(e) => setHandle1(e.target.value)}
                  placeholder="First Handle"
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border-2 border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 outline-none transition-all text-gray-200 placeholder-gray-400"
                />
                <Search className="absolute right-3 top-3 text-gray-400" size={20} />
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={handle2}
                  onChange={(e) => setHandle2(e.target.value)}
                  placeholder="Second Handle"
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border-2 border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 outline-none transition-all text-gray-200 placeholder-gray-400"
                />
                <Search className="absolute right-3 top-3 text-gray-400" size={20} />
              </div>
            </div>

            <button
              onClick={fetchUserData}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Fetching Data..." : "Compare Profiles"}
            </button>

            {error && (
              <div className="bg-red-900/50 text-red-400 p-4 rounded-lg text-center border border-red-700">
                {error}
              </div>
            )}
          </div>
        </div>

        {(user1 || user2) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total Problems Solved"
              value1={user1?.totalSolved}
              value2={user2?.totalSolved}
              icon={Trophy}
            />
            <StatCard
              title="Easy Problems"
              value1={user1?.easySolved}
              value2={user2?.easySolved}
              icon={Code2}
            />
            <StatCard
              title="Medium Problems"
              value1={user1?.mediumSolved}
              value2={user2?.mediumSolved}
              icon={Brain}
            />
            <StatCard
              title="Hard Problems"
              value1={user1?.hardSolved}
              value2={user2?.hardSolved}
              icon={Swords}
            />
            <StatCard
              title="Global Ranking"
              value1={user1?.ranking}
              value2={user2?.ranking}
              icon={Crown}
            />
          </div>
        )}

        <footer className="mt-16 text-center">
          <p className="text-gray-400 mb-4">Made with ❤️ by Abhishek Patel</p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://github.com/itsabhishekpatel01"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-indigo-400 transition-colors"
            >
              <Github size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/itsabhishekpatel01/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-indigo-400 transition-colors"
            >
              <Linkedin size={24} />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LeetCodeProfileAnalyzer;