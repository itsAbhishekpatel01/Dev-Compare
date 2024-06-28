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
                `https://codechef-api.vercel.app/${handle1}`
            );
            const data1 = await response1.json();

            const response2 = await fetch(
                `https://codechef-api.vercel.app/${handle2}`
            );
            const data2 = await response2.json();
            setUser1(data1);
            setUser2(data2);


        } catch (error) {
            console.error("Error fetching data:", error);
            setError("An error occurred || CodeForces Server Down");
        }
    };



    return (
       <>
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-200 to-gray-300 font-sans">
            <h1 className="text-3xl font-bold text-center mt-8 mb-6 text-gray-800 shadow-md">
                CodeChef Profile Analyzer
            </h1>
            <label className="mb-2">Enter CodeChef Handle </label>
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
                            <td className="border px-4 py-2">Avatar</td>
                            <td className="border px-4 py-2">
                                {user1 && <img src={user1.profile} alt="handle1" className="rounded-full w-24" />}
                            </td>
                            <td className="border px-4 py-2">
                                {user2 && <img src={user2.profile} alt="handle2" className="rounded-full w-24" />}
                            </td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Contests</td>
                            <td className="border px-4 py-2">{user1 && user1.ratingData.length}</td>
                            <td className="border px-4 py-2">{user1 && user2.ratingData.length}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Current Rating</td>
                            <td className="border px-4 py-2">{user1 && user1.currentRating}</td>
                            <td className="border px-4 py-2">{user2 && user2.currentRating}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Max Rating</td>
                            <td className="border px-4 py-2">{user1 && user1.highestRating}</td>
                            <td className="border px-4 py-2">{user2 && user2.highestRating}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Stars</td>
                            <td className="border px-4 py-2">{user1 && user1.stars}</td>
                            <td className="border px-4 py-2">{user2 && user2.stars}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Global Rank</td>
                            <td className="border px-4 py-2">{user1 && user1.globalRank}</td>
                            <td className="border px-4 py-2">{user2 && user2.globalRank}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Country Rank</td>
                            <td className="border px-4 py-2">{user1 && user1.countryRank}</td>
                            <td className="border px-4 py-2">{user2 && user2.countryRank}</td>
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
        <div className="mdl-grid">
      </div>
       </>
    );
};

export default CodeforcesProfileCompare;
