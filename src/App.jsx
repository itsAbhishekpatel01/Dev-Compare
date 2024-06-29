import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import CodeforcesProfileCompare from "./components/CodeforcesProfileCompare";
import LeetCodeProfileCompare from "./components/LeetCodeProfileCompare";
import CodeChefProfileCompare from "./components/CodeChefProfileCompare";
import Testing from "./components/Testing";



export const data = [
  ["Element", "Density", { role: "style" }],
  ["Copper", 8.94, "#b87333"], // RGB value
  ["Silver", 10.49, "silver"], // English color name
  ["Gold", 19.3, "gold"],
  ["Platinum", 21.45, "color: #e5e4e2"], // CSS-style declaration
];

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/codeforces" element={<CodeforcesProfileCompare />} />
        <Route path="/leetcode" element={<LeetCodeProfileCompare />} />
        <Route path="/codechef" element={<CodeChefProfileCompare/>} />
        <Route path="/testing" element={<Testing/>} />
      </Routes>
    </Router>
  );
};

export default App;
