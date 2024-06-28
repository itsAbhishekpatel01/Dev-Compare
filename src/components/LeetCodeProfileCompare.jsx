import React, { useState } from "react";

const CodeforcesProfileCompare = () => {
    const [handle1, setHandle1] = useState("");
    const [handle2, setHandle2] = useState("");
    const [error, setError] = useState("");
    const [user1, setUser1] = useState(null);
    const [user2, setUser2] = useState(null);

    const fetchUserData = async () => {
        if (!handle1 || !handle2) {
            setError("Please enter user handle");
            return;
        }
        setError("");

        try {
            const response1 = await fetch(
                `https://leetcode-api-faisalshohag.vercel.app/${handle1}`
            );
            const data1 = await response1.json();

            const response2 = await fetch(
                `https://leetcode-api-faisalshohag.vercel.app/${handle2}`
            );
            const data2 = await response2.json();
            setUser1(data1);
            setUser2(data2);
        }
        catch (error) {
            console.error("Error fetching data:", error);
            setError("An error occurred || CodeForces Server Down");
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-200 to-gray-300 font-sans">
            <h1 className="text-3xl font-bold text-center mt-8 mb-6 text-gray-800 shadow-md">
                LeetCode Profile Analyzer
            </h1>
            <label className="mb-2">Enter LeetCode Handle </label>
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    value={handle1}
                    onChange={(e) => setHandle1(e.target.value)}
                    placeholder="Handle1"
                    className="px-4 py-2 border-2 border-gray-300 rounded shadow-inner"
                />
                <input
                    type="text"
                    value={handle2}
                    onChange={(e) => setHandle2(e.target.value)}
                    placeholder="Handle2"
                    className="px-4 py-2 border-2 border-gray-300 rounded shadow-inner"
                />
            </div>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <button
                onClick={fetchUserData}
                className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
            >
                Fetch Data
            </button>

            <div className="w-full flex flex-col items-center mt-6">
                <table className="table-auto w-4/5 border-2 border-gray-400 shadow-lg">
                    <thead className="bg-yellow-200">
                        <tr>
                            <th className="px-4 py-2">Parameter</th>
                            <th className="px-4 py-2">Handle1</th>
                            <th className="px-4 py-2">Handle2</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2">Total Solved</td>
                            <td className="border px-4 py-2">{user1 && user1.totalSolved}</td>
                            <td className="border px-4 py-2">{user2 && user2.totalSolved}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Easy</td>
                            <td className="border px-4 py-2">{user1 && user1.easySolved}</td>
                            <td className="border px-4 py-2">{user2 && user2.easySolved}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Medium</td>
                            <td className="border px-4 py-2">{user1 && user1.mediumSolved}</td>
                            <td className="border px-4 py-2">{user2 && user2.mediumSolved}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Hard</td>
                            <td className="border px-4 py-2">{user1 && user1.hardSolved}</td>
                            <td className="border px-4 py-2">{user2 && user2.hardSolved}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Ranking</td>
                            <td className="border px-4 py-2">{user1 && user1.ranking}</td>
                            <td className="border px-4 py-2">{user2 && user2.ranking}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p className="text-sm mt-8">
                Made with ❤️ by{" "}
                <a
                    href="https://www.linkedin.com/in/itsabhishekpatel01/"
                    className="text-blue-600 font-bold underline"
                >
                    Abhishek Patel
                </a>
            </p>
        </div>
    );
};

export default CodeforcesProfileCompare;
