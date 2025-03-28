import React, { useState } from "react";
import { Search, Trophy, Star, Award, Globe, Flag, Github, Linkedin, Users } from "lucide-react";

const CodeChefProfileAnalyzer = () => {
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
        fetch(`https://codechef-api.vercel.app/${handle1}`),
        fetch(`https://codechef-api.vercel.app/${handle2}`)
      ]);
      
      const [data1, data2] = await Promise.all([
        response1.json(),
        response2.json()
      ]);
      
      setUser1(data1);
      setUser2(data2);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred || CodeChef Server Down");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value1, value2, icon: Icon }) => (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300 border border-gray-700 hover:border-indigo-500">
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

  const ProfileCard = ({ user, handle }) => (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500">
          {user?.profile && (
            <img 
              src={user.profile} 
              alt={handle} 
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <h3 className="text-xl font-semibold text-gray-200">{handle}</h3>
        <div className="flex items-center space-x-2">
          <Star className="text-yellow-400" size={20} />
          <span className="text-gray-300">{user?.stars || '-'} Stars</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4">
            CodeChef Profile Analyzer
          </h1>
          <p className="text-lg text-gray-300">Compare CodeChef profiles and track your progress</p>
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <ProfileCard user={user1} handle={handle1} />
              <ProfileCard user={user2} handle={handle2} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Current Rating"
                value1={user1?.currentRating}
                value2={user2?.currentRating}
                icon={Trophy}
              />
              <StatCard
                title="Highest Rating"
                value1={user1?.highestRating}
                value2={user2?.highestRating}
                icon={Award}
              />
              <StatCard
                title="Total Contests"
                value1={user1?.ratingData?.length}
                value2={user2?.ratingData?.length}
                icon={Users}
              />
              <StatCard
                title="Global Rank"
                value1={user1?.globalRank}
                value2={user2?.globalRank}
                icon={Globe}
              />
              <StatCard
                title="Country Rank"
                value1={user1?.countryRank}
                value2={user2?.countryRank}
                icon={Flag}
              />
            </div>
          </>
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

export default CodeChefProfileAnalyzer;