import React, { useState } from "react";
import { useEffect } from "react";


function maxRatingChange(ratingList) {
    //returns an array - [maxUp, maxDown]
    let ans = [0, 5000];
    ratingList.forEach(element => {
        if (element.oldRating < element.newRating)
            ans[0] = Math.max(ans[0], element.newRating - element.oldRating);
        else
            ans[1] = Math.min(ans[1], element.newRating - element.oldRating)
    });
    return ans;
}

function bestWorstRank(ratingList) {
    //returns an array - [BestRank, WorstRank]
    let rank = [1000000, 1];
    ratingList.forEach(element => {
        rank[0] = Math.min(rank[0], element.rank);
        rank[1] = Math.max(rank[1], element.rank);
    });
    return rank;
}

const CodeforcesProfileCompare = () => {

    const [handle1, setHandle1] = useState("");
    const [handle2, setHandle2] = useState("");
    const [error, setError] = useState("");
    const [user1, setUser1] = useState(0);
    const [user2, setUser2] = useState(0);
    const [rating1, setRating1] = useState(0);
    const [rating2, setRating2] = useState(0);
    const [submission1, setSubmission1] = useState(0);
    const [submission2, setSubmission2] = useState(0);

    // CHARTS

    //Rating Charts

    async function fetchUserData() {
        if (!handle1 || !handle2) {
            setError("Please enter user handle");
            return;
        }
        setError("");

        try {
            // Fetch user info (with caching)
            const user1 = await fetchData(`user.info?handles=${handle1}`, `user_info_${handle1}`);
            const user2 = await fetchData(`user.info?handles=${handle2}`, `user_info_${handle2}`);

            if (user1.status === "OK" && user2.status === "OK") {
                setUser1(user1.result[0]);
                setUser2(user2.result[0]);
            } else {
                setError("User not found");
            }

            // Fetch user ratings (with caching)
            const rating1 = await fetchData(`user.rating?handle=${handle1}`, `user_rating_${handle1}`);
            const rating2 = await fetchData(`user.rating?handle=${handle2}`, `user_rating_${handle2}`);

            if (rating1.status === "OK" && rating2.status === "OK") {
                setRating1(rating1.result);
                setRating2(rating2.result);
            } else {
                setError("User rating not found");
            }

            // Fetch user submissions (with caching)
            const submissions1 = await fetchData(`user.status?handle=${handle1}`, `user_submissions_${handle1}`);
            const submissions2 = await fetchData(`user.status?handle=${handle2}`, `user_submissions_${handle2}`);

            if (submissions1.status === "OK" && submissions2.status === "OK") {
                setSubmission1(submissions1.result);
                setSubmission2(submissions2.result);
            } else {
                setError("User submissions not found");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            setError("An error occurred || CodeForces Server Down");
        }
    }

    // Helper function to fetch data with caching
    async function fetchData(endpoint, cacheKey) {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        try {
            const response = await fetch(`https://codeforces.com/api/${endpoint}`);
            const data = await response.json();
            localStorage.setItem(cacheKey, JSON.stringify(data));
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error; // Rethrow error to handle it in fetchUserData
        }
    }


    useEffect(() => {
        google.charts.load('current', { packages: ['corechart'] });

        function drawRatingChart() {
            const data = google.visualization.arrayToDataTable([
                ['RatingType', user1.handle, user2.handle],
                ['Current Rating', user1.rating, user2.rating],
                ['Max Rating', user1.maxRating, user2.maxRating],
                ['Min Rating', rating1[0].newRating, rating2[0].newRating],
            ]);

            const options = {
                legend: { position: 'top', alignment: 'end' },
                bar: { groupWidth: '40%' },
                vAxis: { minValue: 0 }
            };

            const chart = new google.visualization.ColumnChart(document.getElementById('ratingChart'));
            chart.draw(data, options);
        }
        if (user1.rating && user2.rating && rating1 && rating2) drawRatingChart();
    }, [user1, user2, rating1, rating2]);

    //Contest Charts
    useEffect(() => {
        google.charts.load('current', { packages: ['corechart'] });

        function drawContestChart() {
            const data = google.visualization.arrayToDataTable([
                ['handle', 'Contests', { role: 'style' }, { role: 'anotation' }],
                [user1.handle, rating1.length, 'blue-200', 'ok'],
                [user2.handle, rating2.length, 'red', rating2.length],
            ]);


            const options = {
                title: "Contest",
                vAxis: {
                    minValue: 0,
                    gridlines: { count: 5 }
                },
                legend: { position: 'none' },
                bar: { groupWidth: '30%' },
                annotations: {
                    alwaysOutside: true,
                    textStyle: {
                        fontSize: 12,
                        auraColor: 'none',
                        color: '#555',
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'out',
                    startup: true
                }
            };

            const chart = new google.visualization.ColumnChart(document.getElementById('contestChart'));
            chart.draw(data, options);
        }
        if (user1.rating) drawContestChart();
    }, [rating1]);

    //MaxRatingChange Charts
    useEffect(() => {
        google.charts.load('current', { packages: ['corechart'] });

        function drawMaxRatingChangeChart() {
            const max1 = maxRatingChange(rating1);
            const max2 = maxRatingChange(rating2);

            const data = google.visualization.arrayToDataTable([
                ['handle', user1.handle, user2.handle],
                ['Max Up', max1[0], max2[0]],
                ['Max Down', max1[1], max2[1]],
            ]);

            const options = {
                title: "Max Rating Change",
                vAxis: {
                    minValue: 0,
                    gridlines: { count: 3 }
                },
                legend: { position: 'top', alignment: 'end' },
                bar: { groupWidth: '30%' },
                annotations: {
                    alwaysOutside: true,
                    textStyle: {
                        fontSize: 12,
                        auraColor: 'none',
                        color: '#555',
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'out',
                    startup: true
                }

            };

            const chart = new google.visualization.ColumnChart(document.getElementById('ratingChange'));
            chart.draw(data, options);
        }
        if (user1.rating) drawMaxRatingChangeChart();
    }, [rating1]);

    //Worst and Best Rank Charts
    useEffect(() => {
        google.charts.load('current', { packages: ['table'] });

        function drawBestWorstRankChart() {
            const rank1 = bestWorstRank(rating1);
            const rank2 = bestWorstRank(rating2);

            const data = new google.visualization.DataTable();
            data.addColumn('string', 'Best and Worst Ranks');
            data.addColumn('number', user1.handle);
            data.addColumn('number', user2.handle);
            data.addRow(['Best', rank1[0], rank2[0]]);
            data.addRow(['Worst', rank1[1], rank2[1]]);

            const options = {
                width: '100%',
                height: '100%',
                cssClassNames: {
                    headerRow: 'bg-gradient-to-br from-blue-600 to-teal-300 outline-none text-center',
                }
            };

            const chart = new google.visualization.Table(document.getElementById('bestWorstRank'));
            chart.draw(data, options);
        }
        if (user1 && user2 && rating1 && rating2) drawBestWorstRankChart();
    }, [user1, user2, rating1, rating2]);

    //TimeLine Chart
    useEffect(() => {
        google.charts.load('current', { packages: ['corechart'] });

        function drawTimelineChart() {

            let i = 0, j = 0, n = rating1.length, m = rating2.length;

            const dataForCommonContest = [['Common contests', user1.handle, user2.handle, 'Distance']];
            

            let user1LastRating = 0;
            let user2LastRating = 0;
            const arr = [];

            while (i < n && j < m) {
                const time1 = rating1[i].ratingUpdateTimeSeconds;
                const time2 = rating2[j].ratingUpdateTimeSeconds;
                if (time1 === time2) {
                    user1LastRating = rating1[i].newRating;
                    user2LastRating = rating2[j].newRating;
                    arr.push([time1, user1LastRating, user2LastRating]);
                    i++; j++;
                }
                else if (time1 < time2) {
                    user1LastRating = rating1[i].newRating;
                    arr.push([time1, user1LastRating, user2LastRating]);
                    i++;
                }
                else {
                    user2LastRating = rating2[j].newRating;
                    arr.push([time2, user1LastRating, user2LastRating]);
                    j++;
                }
            }
            while (i < n) {
                const time1 = rating1[i].ratingUpdateTimeSeconds;
                user1LastRating = rating1[i].newRating;
                i++;
                arr.push([time1, user1LastRating, user2LastRating]);
            }
            while (j < m) {
                const time2 = rating2[j].ratingUpdateTimeSeconds;
                user2LastRating = rating2[j].newRating;
                j++;
                arr.push([time2, user1LastRating, user2LastRating]);
            }

            n = arr.length;
            for (i = 0; i < n; i++) {
                const timestamp = arr[i][0];
                const date = new Date(timestamp * 1000);
                const day = date.getDate();
                const month = date.toLocaleString('default', { month: 'short' });
                const year = date.getFullYear() % 2000;
                const timeInString = `${month} ${year}`;
                arr[i][0] = timeInString;
            }


            const data = new google.visualization.DataTable();
            data.addColumn('string', 'time');
            data.addColumn('number', user1.handle);
            data.addColumn('number', user2.handle);

            arr.forEach(element => {
                data.addRow(element);
            });

            const options = {
                title: 'Timeline',
                curveType: 'function',
                legend: { position: 'top' },
                vAxis: {
                    viewWindow: {
                        min: 0,
                    }
                },
                hAxis: {
                    ticks: [new Date(2023, 0, 1), new Date(2023, 3, 1), new Date(2023, 6, 1), new Date(2023, 9, 1)]
                }
            };

            const chart = new google.visualization.LineChart(document.getElementById('timeline'));
            chart.draw(data, options);
        }
        if (user1 && user2 && rating1 && rating2) drawTimelineChart();
    }, [user1, user2, rating1, rating2]);

    //All Charts from here Charts
    useEffect(() => {
        google.charts.load('current', { packages: ['corechart'] });

        function drawTriedSolvedChart() {
            let problemVerdicts1 = new Map(); //map<id,[verdicts]>
            let problemVerdicts2 = new Map(); //map<id,[verdicts]>
            let solved1 = 0, tried1 = 0, unSolved1 = 0;
            let solved2 = 0, tried2 = 0, unSolved2 = 0;
            let maxSubmission1 = 0, maxSubmission2 = 0;
            let solvedInOneSubmission1 = 0, solvedInOneSubmission2 = 0;
            let level1 = new Map();
            let level2 = new Map();
            let rating1 = new Map();
            let rating2 = new Map();


            submission1.forEach(element => {
                const ind = element.problem.index;
                const r = element.problem.rating;
                if (element.verdict == "OK") {
                    if (level1.has(ind)) level1.set(ind, 1 + level1.get(ind));
                    else level1.set(ind, 1);
                    if (rating1.has(r)) rating1.set(r, 1 + rating1.get(r));
                    else rating1.set(r, 1);
                }
                const problemId = `${element.contestId}${element.problem.index}`;
                if (problemVerdicts1.has(problemId)) {
                    problemVerdicts1.get(problemId).push(element.verdict); // Push to existing array
                } else {
                    problemVerdicts1.set(problemId, [element.verdict]);  // Create new array with the first verdict
                }
            });

            submission2.forEach(element => {
                const ind = element.problem.index;
                const r = element.problem.rating;
                if (element.verdict == "OK") {
                    if (level2.has(ind)) level2.set(ind, 1 + level2.get(ind));
                    else level2.set(ind, 1);
                    if (rating2.has(r)) rating2.set(r, 1 + rating2.get(r));
                    else rating2.set(r, 1);
                }
                const problemId = `${element.contestId}${element.problem.index}`;
                if (problemVerdicts2.has(problemId)) {
                    problemVerdicts2.get(problemId).push(element.verdict); // Push to existing array
                } else {
                    problemVerdicts2.set(problemId, [element.verdict]);  // Create new array with the first verdict
                }
            });

            for (const [problemId, verdicts] of problemVerdicts1) {
                tried1++;
                if (verdicts.includes("OK")) {
                    solved1++;
                    maxSubmission1 = Math.max(maxSubmission1, verdicts.length);
                    if (verdicts.length == 1) solvedInOneSubmission1++;
                }
                else unSolved1++;

            }
            for (const [problemId, verdicts] of problemVerdicts2) {
                tried2++;
                if (verdicts.includes("OK")) {
                    solved2++;
                    maxSubmission2 = Math.max(maxSubmission2, verdicts.length);
                    if (verdicts.length == 1) solvedInOneSubmission2++;
                }
                else unSolved2++;
            }

            // console.log(level1);


            const data = google.visualization.arrayToDataTable([
                ['Solved-Tried', user1.handle, user2.handle],
                ['Tried', tried1, tried2],
                ['Solved', solved1, solved2],
            ]);

            const options = {
                vAxis: {
                    minValue: 0,
                    gridlines: { count: 5 }
                },
                legend: { position: 'top' },
                bar: { groupWidth: '30%' },
                animation: {
                    duration: 1000,
                    easing: 'out',
                    startup: true
                }
            };
            const options2 = {
                'title': 'Unsolved',
                vAxis: {
                    minValue: 0,
                    gridlines: { count: 5 }
                },
                legend: { position: 'none' },
                bar: { groupWidth: '30%' },
                animation: {
                    duration: 1000,
                    easing: 'out',
                    startup: true
                }
            };

            const options3 = {
                'title': 'Average Submission to solve a problem',
                vAxis: {
                    minValue: 0,
                    gridlines: { count: 5 }
                },
                legend: { position: 'none' },
                bar: { groupWidth: '30%' },
                animation: {
                    duration: 1000,
                    easing: 'out',
                    startup: true
                }
            };

            const options4 = {
                'title': 'Max Submission to solve a problem',
                vAxis: {
                    minValue: 0,
                    gridlines: { count: 5 }
                },
                legend: { position: 'none' },
                bar: { groupWidth: '30%' },
                animation: {
                    duration: 1000,
                    easing: 'out',
                    startup: true
                }
            };

            const options5 = {
                'title': 'Solved in one Submission(%)',
                vAxis: {
                    minValue: 0,
                    gridlines: { count: 5 },
                    format: '#\'%\''
                },
                legend: { position: 'none' },
                bar: { groupWidth: '30%' },
                animation: {
                    duration: 1000,
                    easing: 'out',
                    startup: true
                }
            };

            const options6 = {
                'title': 'Level',
                vAxis: {
                    minValue: 0,
                    gridlines: { count: 5 }
                },
                legend: { position: 'none' },
                bar: { groupWidth: '30%' },
                animation: {
                    duration: 1000,
                    easing: 'out',
                    startup: true
                },
                annotations: {
                    alwaysOutside: true,
                    textStyle: {
                        fontSize: 10,
                        auraColor: 'none',
                        color: '#555'
                    }
                }
            };

            const options7 = {
                'title': 'Rating',
                vAxis: {
                    minValue: 0,
                    // gridlines: { count: 4 }
                },
                legend: { position: 'left' },
                bar: { groupWidth: '80%' },
                animation: {
                    duration: 1000,
                    easing: 'out',
                    startup: true
                },
                annotations: {
                    alwaysOutside: true,
                    textStyle: {
                        fontSize: 10,
                        auraColor: 'none',
                        color: '#555'
                    }
                },
                chartArea: {
                    width: '200%',
                    left: 75,
                },
            };

            const chart = new google.visualization.ColumnChart(document.getElementById('triedSolved'));
            chart.draw(data, options);

            const data2 = google.visualization.arrayToDataTable([
                ['handle', 'Unsolved', { role: 'style' }],
                [user1.handle, unSolved1, 'red'],
                [user2.handle, unSolved2, 'blue'],
            ]);

            const chart2 = new google.visualization.ColumnChart(document.getElementById('unSolved'));
            chart2.draw(data2, options2);


            const data3 = google.visualization.arrayToDataTable([
                ['handle', 'Average Submission per question', { role: 'style' }],
                [user1.handle, tried1 / solved1, 'red'],
                [user2.handle, tried2 / solved2, 'blue'],
            ]);

            const chart3 = new google.visualization.ColumnChart(document.getElementById('averageSubmission'));
            chart3.draw(data3, options3);

            const data4 = google.visualization.arrayToDataTable([
                ['handle', 'Max Submission for single question', { role: 'style' }],
                [user1.handle, maxSubmission1, 'red'],
                [user2.handle, maxSubmission2, 'blue'],
            ]);

            const chart4 = new google.visualization.ColumnChart(document.getElementById('maxSubmission'));
            chart4.draw(data4, options4);

            const data5 = google.visualization.arrayToDataTable([
                ['handle', 'Solved with one submission(%)', { role: 'style' }],
                [user1.handle, parseInt(solvedInOneSubmission1 * 100 / tried1), 'red'],
                [user2.handle, parseInt(solvedInOneSubmission2 * 100 / tried2), 'blue'],
            ]);

            const chart5 = new google.visualization.ColumnChart(document.getElementById('singleSubmission'));
            chart5.draw(data5, options5);

            let levelData = [['Level', user1.handle, { role: 'annotation' }, user2.handle, { role: 'annotation' }]];
            for (let i = 65; i <= 90; i++) {
                const c = String.fromCharCode(i);
                const temp = [c, level1.get(c) || 0, level1.get(c) || 0, level2.get(c) || 0, level2.get(c) || 0]

                if (temp[1] || temp[3]) {
                    levelData.push(temp);
                }
            }

            const data6 = google.visualization.arrayToDataTable(levelData);
            const chart6 = new google.visualization.ColumnChart(document.getElementById('level'));
            chart6.draw(data6, options6);

            let ratingData = [['Rating', user1.handle, user2.handle]];
            for (let i = 800; i <= 4000; i += 100) {
                const temp = [i, rating1.get(i) || 0, rating2.get(i) || 0]

                if (temp[1] || temp[2]) {
                    ratingData.push(temp);
                    console.log(temp);
                }
            }
            console.log(ratingData);

            const data7 = google.visualization.arrayToDataTable(ratingData);
            const chart7 = new google.visualization.ColumnChart(document.getElementById('rating'));
            chart7.draw(data7, options7);
        }
        if (submission1 && submission2 && user1 && user2) drawTriedSolvedChart();
    }, [submission1, submission2, user1, user2]);

    // return (
    //     <>
    //         <div className="flex flex-col items-center  bg-gradient-to-br   font-sans">
    //             <h1 className="text-3xl font-bold text-center mt-8 mb-6 text-gray-800 shadow-lg shadow-gray-200">
    //                 Codeforces Profile Analyzer
    //             </h1>
    //             <label className="mb-2 text-lg">Enter Codeforces Handle </label>
    //             <div className="flex gap-4 mb-4 justify-around flex-col  md:flex-row">
    //                 <input
    //                     type="text"
    //                     value={handle1}
    //                     onChange={(e) => setHandle1(e.target.value)}
    //                     placeholder="Handle1"
    //                     className="px-4 py-2 border-2 border-gray-300 rounded-md shadow-inner hover:border-green-300"
    //                 />
    //                 <input
    //                     type="text"
    //                     value={handle2}
    //                     onChange={(e) => setHandle2(e.target.value)}
    //                     placeholder="Handle2"
    //                     className="px-4 py-2 border-2 border-gray-300 rounded-md shadow-inner hover:border-green-300"
    //                 />
    //             </div>
    //             {error && <p className="text-red-600 mb-4">{error}</p>}
    //             <button
    //                 onClick={fetchUserData}
    //                 className="bg-green-500 text-white px-4 py-2 mb-4 rounded-md shadow hover:bg-green-600"
    //             >
    //                 Fetch Data
    //             </button>

    //         </div>

    //         <div className="bg-gradient-to-br from-purple-400 via-blue-500 via-slate-200 to-purple-600 font-sans">
    //             {/* All chart parent div */}
    //             <div className="flex justify-center lg:justify-around flex-col  lg:flex-row rounded-lg mx-7 ">
    //                 {/* First Div for Rating in Left + Contest in right */}
    //                 <div id="ratingChart" className="h-80 md:w-3/5 my-3 mx-7 shadow-lg">{/* rating chart */}</div>
    //                 <div id="contestChart" className="h-80 my-2 mx-7 shadow-md">{/*  Contest Container */}</div>
    //             </div>
    //             <div className="flex justify-center mx-7 rounded-lg">
    //                 {/* Max Rating Change Chart Container */}
    //                 <div id="ratingChange" className="h-64 w-screen md:w-2/3 md:h-96 my-2 px-7 rounded-lg"></div>
    //             </div>
    //             <div className="flex justify-center bg-gradient-to-br  ">
    //                 {/* Best and Worst Rank Table Chart Container */}
    //                 <div id="bestWorstRank" className="h-28 w-screen md:w-2/3 my-2 mx-7 "></div>
    //             </div>
    //             <div className="flex justify-center bg-gradient-to-br ">
    //                 {/* TimeLine */}
    //                 <div id="timeline" className="h-64 w-screen md:w-4/5 md:h-80 my-2 mx-5 shadow-lg"></div>
    //             </div>
    //             <div className="flex flex-col flex-wrap lg:flex-row justify-around gap-3  ">
    //                 {/* Tried-Solved-Chart, UnSolved-Chart, Average Submission Chart 1,2,3  */}
    //                 <div id="triedSolved" className="h-64 w-4/5 my-2  shadow-lg"></div>
    //                 <div id="unSolved" className="h-64  my-2 shadow-lg"></div>
    //                 <div id="averageSubmission" className="h-64  my-2  shadow-lg"></div>
    //             </div>
    //             <div className="flex justify-center gap-7 py-2 flex-col lg:flex-row  ">
    //                 {/* Max Submission Chart, Solved with one submission Chart - 4 and 5 */}
    //                 <div id="maxSubmission" className="h-64  my-2  shadow-lg"></div>
    //                 <div id="singleSubmission" className="h-64  my-2  shadow-lg"></div>
    //             </div>
    //             <div className="flex justify-center bg-gradient-to-br  ">
    //                 {/* Level Chart no - 6 */}
    //                 <div id="level" className="h-64  my-3 w-screen md:w-4/5  shadow-lg"></div>
    //             </div>
    //             <div className="h-96 flex justify-center bg-gradient-to-br  ">
    //                 {/* Rating Chart no - 6 */}
    //                 <div id="rating" className="h-96 overflow-x-scroll my-3 w-screen md:w-4/5  shadow-lg"></div>
    //             </div>
    //         </div>
    //     </>
    // );

    
    return (
        <>
            <div className="bg-gradient-to-br from-yellow-200  via-blue-100 via-blue-200 to-red-600 font-sans min-h-screen">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-bold text-center mt-8 mb-6 text-gray-800">
                        Codeforces Profile Analyzer
                    </h1>
                    <label className="mb-2 text-lg text-gray-900">Enter Codeforces Handle </label>
                    <div className="flex gap-4 mb-4 justify-around flex-col md:flex-row">
                        <input
                            type="text"
                            value={handle1}
                            onChange={(e) => setHandle1(e.target.value)}
                            placeholder="Handle1"
                            className="px-4 py-2 border-2 border-gray-300 rounded-md shadow-inner hover:border-green-300"
                        />
                        <input
                            type="text"
                            value={handle2}
                            onChange={(e) => setHandle2(e.target.value)}
                            placeholder="Handle2"
                            className="px-4 py-2 border-2 border-gray-300 rounded-md shadow-inner hover:border-green-300"
                        />
                    </div>
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                    <button
                        onClick={fetchUserData}
                        className="bg-green-500 text-white px-4 py-2 mb-4 rounded-md shadow hover:bg-green-600"
                    >
                        Fetch Data
                    </button>
                </div>
    
                {/* All chart parent div */}
                <div className="flex flex-col gap-4">
                    <div className="flex justify-center lg:justify-around flex-col lg:flex-row rounded-lg mx-7">
                        {/* First Div for Rating in Left + Contest in right */}
                        <div id="ratingChart" className="h-80 md:w-3/5 my-3 mx-7 shadow-lg rounded-lg">{/* rating chart */}</div>
                        <div id="contestChart" className="h-80 my-2 mx-7 shadow-md rounded-lg">{/* Contest Container */}</div>
                    </div>
                    <div className="flex justify-center mx-7 rounded-lg">
                        {/* Max Rating Change Chart Container */}
                        <div id="ratingChange" className="h-64 w-screen md:w-2/3 md:h-96 my-2 px-7 rounded-lg shadow-lg"></div>
                    </div>
                    <div className="flex justify-center mx-7 rounded-lg">
                        {/* Best and Worst Rank Table Chart Container */}
                        <div id="bestWorstRank" className="h-28 w-screen md:w-2/3 my-2 mx-7 rounded-lg shadow-lg"></div>
                    </div>
                    <div className="flex justify-center mx-7 rounded-lg">
                        {/* Timeline */}
                        <div id="timeline" className="h-64 w-screen md:w-4/5 md:h-80 my-2 mx-5 shadow-lg rounded-lg"></div>
                    </div>
                    <div className="flex flex-col flex-wrap lg:flex-row justify-around gap-3 mx-7 rounded-lg">
                        {/* Tried-Solved-Chart, UnSolved-Chart, Average Submission Chart 1,2,3 */}
                        <div id="triedSolved" className="h-64 w-4/5 my-2 shadow-lg rounded-lg"></div>
                        <div id="unSolved" className="h-64 my-2 shadow-lg rounded-lg"></div>
                        <div id="averageSubmission" className="h-64 my-2 shadow-lg rounded-lg"></div>
                    </div>
                    <div className="flex justify-center gap-7 py-2 flex-col lg:flex-row mx-7 rounded-lg">
                        {/* Max Submission Chart, Solved with one submission Chart - 4 and 5 */}
                        <div id="maxSubmission" className="h-64 my-2 shadow-lg rounded-lg"></div>
                        <div id="singleSubmission" className="h-64 my-2 shadow-lg rounded-lg"></div>
                    </div>
                    <div className="flex justify-center mx-7 rounded-lg">
                        {/* Level Chart no - 6 */}
                        <div id="level" className="h-64 my-3 w-screen md:w-4/5 shadow-lg rounded-lg"></div>
                    </div>
                    <div className="h-96 flex justify-center mx-7 rounded-lg">
                        {/* Rating Chart no - 6 */}
                        <div id="rating" className="h-96 overflow-x-scroll my-3 w-screen md:w-4/5 shadow-lg rounded-lg"></div>
                    </div>
                </div>
            </div>
        </>
    );
    
};

export default CodeforcesProfileCompare;
