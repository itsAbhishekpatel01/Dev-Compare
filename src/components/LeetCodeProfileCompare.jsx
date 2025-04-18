import React, { useState } from "react";
import { Github, Linkedin } from "lucide-react";
import {
  LineChart,Line,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid, Legend,RadialBarChart,RadialBar,BarChart,Bar,Cell,AreaChart,Area,
} from "recharts";

const LeetCodeProfileAnalyzer =()=>{
  const [handle1,setHandle1]=useState("");
  const [handle2,setHandle2]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const [contestData,setContestData]=useState([]);
  const [submissionData,setSubmissionData]=useState({
    total: [],
    easy: [],
    medium: [],
    hard: [],
  });
  const [globalRankingData, setGlobalRankingData] = useState([]);

  const Colour_1 = "#6366f1"; // Indigo
  const Colour_2 = "#a855f7"; // Purple

  const query = `
    query userContestRankingInfo($username: String!) {
      matchedUser(username: $username) {
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
      userContestRanking(username: $username) {
        globalRanking
      }
      userContestRankingHistory(username: $username) {
        attended
        rating
        contest {
          title
          startTime
        }
      }
    }
  `;

  const fetchUserData = async () => {
    if (!handle1 || !handle2) {
      setError("Please enter both user handles");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const [response1, response2] = await Promise.all([
        fetch("https://cors-anywhere.herokuapp.com/https://leetcode.com/graphql/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, variables: { username: handle1 } }),
        }),
        fetch("https://cors-anywhere.herokuapp.com/https://leetcode.com/graphql/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, variables: { username: handle2 } }),
        }),
      ]);

      const [result1, result2]=await Promise.all([
        response1.json(),
        response2.json(),
      ]);

      const history1=result1.data?.userContestRankingHistory || [];
      const history2=result2.data?.userContestRankingHistory || [];

      const map1=history1.filter(item => item.attended).map(item => ({
        date: new Date(item.contest.startTime * 1000).toLocaleDateString(),
        [handle1]:Math.round(item.rating),
      }));

      const map2=history2.filter(item => item.attended).map(item => ({
        date: new Date(item.contest.startTime * 1000).toLocaleDateString(),
        [handle2]:Math.round(item.rating),
      }));

      const allDatesSet = new Set([...map1, ...map2].map(item => item.date));
      const finalContestData = Array.from(allDatesSet).map(date => {
        const obj ={date};
        const entry1=map1.find(item => item.date === date);
        const entry2=map2.find(item => item.date === date);
        if (entry1) obj[handle1]=entry1[handle1];
        if (entry2) obj[handle2]=entry2[handle2];
        return obj;
      });

      finalContestData.sort((a,b)=>new Date(a.date)-new Date(b.date));
      setContestData(finalContestData);

      const sub1=result1.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum || [];
      const sub2=result2.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum || [];

      const getCount=(arr,diff)=>arr.find(item =>item.difficulty === diff)?.count || 0;

      setSubmissionData({
        total:[
          { name: handle1, value: getCount(sub1,"All") },
          { name: handle2, value: getCount(sub2,"All") },
        ],
        easy:[
          { name: handle1, value: getCount(sub1,"Easy") },
          { name: handle2, value: getCount(sub2,"Easy") },
        ],
        medium:[
          { name: handle1, value: getCount(sub1,"Medium") },
          { name: handle2, value: getCount(sub2,"Medium") },
        ],
        hard:[
          { name: handle1, value: getCount(sub1,"Hard") },
          { name: handle2, value: getCount(sub2,"Hard") },
        ],
      });

      const globalRanking1 = result1.data?.userContestRanking?.globalRanking;
      const globalRanking2 = result2.data?.userContestRanking?.globalRanking;

      setGlobalRankingData([
        { name: "Global Ranking", [handle1]: globalRanking1, [handle2]: globalRanking2 },
      ]);

    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong. Maybe LeetCode is down.");
    } finally {
      setLoading(false);
    }
  };

  const renderRadialChart = (title, data) => (
    <div className="w-full md:w-[48%] bg-white p-4 rounded-lg text-black">
      <h2 className="text-center font-bold text-lg mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={250}>
        <RadialBarChart
          cx="50%" cy="50%" innerRadius="30%" outerRadius="80%"
          data={data.map((entry,index)=>({
            ...entry,
            fill: index === 0 ? "#6366f1" : "#a855f7"
          }))}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            minAngle={15} label={{ position: "insideStart", fill: "#fff" }}  background clockWise
            dataKey="value"
          />
<Tooltip
  formatter={(value, name) => {
    if (name==="Dataset1") {
      return [`${handle1}: ${value}`]
    } else if (name === "Dataset2") {
      return [`${handle2}: ${value}`]
        }
    return [value]
  }}
  labelFormatter={() => ''}
/>
        </RadialBarChart>
      </ResponsiveContainer>
  
      {/*center align the legend*/}
      <div className="flex justify-center mt-2 space-x-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: index === 0 ? "#6366f1" : "#a855f7" }}
            ></div>
            <span className="text-sm">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
  const TriangleBar=(props)=>{
    const { fill,x,y,width,height,index }=props;
    const triangleHeight=12; // Adjust the height of the triangle
    return (
      <path
        d={`M${x},${y} L${x + width / 2},${y - triangleHeight} L${x + width},${y} Z`}
        fill={fill}
      />
    );
  };
  

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          LeetCode Profile Analyzer
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <input
            type="text"
            placeholder="First Handle"
            value={handle1}
            onChange={(e) => setHandle1(e.target.value)}
            className="p-3 rounded bg-gray-800 border border-gray-700 w-full"
          />
          <input
            type="text"
            placeholder="Second Handle"
            value={handle2}
            onChange={(e) => setHandle2(e.target.value)}
            className="p-3 rounded bg-gray-800 border border-gray-700 w-full"
          />
        </div>

        <button
          onClick={fetchUserData}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 py-3 rounded text-white font-semibold mb-6"
        >
          {loading ? "Fetching..." : "Compare Profiles"}
        </button>

        {error && <div className="bg-red-500 text-white p-3 rounded text-center mb-6">{error}</div>}

        {contestData.length > 0 && (
          <div className="bg-white text-black p-4 rounded-lg shadow border mt-4 mb-6">
            <h2 className="text-center font-bold text-lg mb-2">🎯 Contest Rating Over Time</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={contestData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" align="right" iconType="circle" iconSize={10} />
                <Line connectNulls type="monotone" dataKey={handle1} stroke={Colour_1} strokeWidth={2} />
                <Line connectNulls type="monotone" dataKey={handle2} stroke={Colour_2} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {submissionData.total.length > 0 && (
          <div className="flex flex-wrap justify-between gap-6 mb-6">
            {renderRadialChart("🔵 Total Problems Solved", submissionData.total)}
            {renderRadialChart("🟢 Easy Problems Solved", submissionData.easy)}
            {renderRadialChart("🟡 Medium Problems Solved", submissionData.medium)}
            {renderRadialChart("🔴 Hard Problems Solved", submissionData.hard)}
          </div>
        )}

{globalRankingData.length > 0 && (
  <div className="w-full p-4 rounded-lg border shadow mb-6 text-black bg-white">
    <h2 className="text-center font-bold text-lg mb-2">🏆 Global Ranking Comparison</h2>
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={globalRankingData}>
        <XAxis dataKey="name" />
        <YAxis reversed />  {/* Lower rank is better */}
        <Tooltip />
        <Legend verticalAlign="top" align="right" iconType="circle" iconSize={10} />

        <Bar dataKey={handle1} fill="#4c6ef5" shape={<TriangleBar />} />
        <Bar dataKey={handle2} fill="#a855f7" shape={<TriangleBar />} />
      </BarChart>
    </ResponsiveContainer>
  </div>
)}

        <footer className="text-center text-gray-500 mt-10">
          Made with ❤️ by Abhishek Patel
          <div className="flex justify-center mt-2 space-x-4">
            <a href="https://github.com/itsabhishekpatel01" target="_blank" rel="noreferrer"><Github /></a>
            <a href="https://www.linkedin.com/in/itsabhishekpatel01/" target="_blank" rel="noreferrer"><Linkedin /></a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LeetCodeProfileAnalyzer;
