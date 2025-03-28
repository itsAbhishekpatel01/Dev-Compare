import React, { useState } from "react";
import { useEffect } from "react";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Button, CardContent } from "@mui/material";
import { Card, Paper, Typography, Box, TextField } from '@mui/material';
import { bestWorstRank, maxRatingChange } from "../lib/codeforcesHelper";


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
    const [contestList, setContestList] = useState(0);
    const [isVisible, setVisibility] = useState(false);

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
                if (!isVisible)
                    setVisibility(!isVisible);
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

            // Fetch Contest List (with caching)
            const contestList = await fetchData(`contest.list`, `contest.list`);

            if (contestList.status === "OK") {
                setContestList(contestList.result)
            } else {
                setError("Contest List not found");
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
        const contestMap1 = new Map();
        const contestMap2 = new Map();
        rating1.forEach(element => {
            contestMap1.set(element.contestId, element);
        });

        rating2.forEach(element => {
            contestMap2.set(element.contestId, element);
        });

        // let i = 0, j = 0, n = rating1.length, m = rating2.length;

        let user1LastRating = 0;
        let user2LastRating = 0;
        const arr = [];

        contestList.sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);
        console.log(contestList);

        contestList.forEach(element => {
            if (contestMap1.has(element.id) && contestMap2.has(element.id)) {
                user1LastRating = contestMap1.get(element.id).newRating;
                user2LastRating = contestMap2.get(element.id).newRating;
            }
            else if (contestMap1.has(element.id)) {
                user1LastRating = contestMap1.get(element.id).newRating;
            }
            else if (contestMap2.has(element.id)) {
                user2LastRating = contestMap2.get(element.id).newRating;
            }
            if(contestMap1.has(element.id) || contestMap2.has(element.id))
            arr.push([element.startTimeSeconds, user1LastRating, user2LastRating]);
        });
        console.log(arr);


        const n = arr.length;
        for (let i = 0; i < n; i++) {
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
    if (user1 && user2 && rating1 && rating2 && submission1 && submission2 && contestList) drawTimelineChart();
}, [user1, user2, rating1, rating2, submission1, submission2, contestList]);

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
            // bar: { groupWidth: '30%' },
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
                // gridlines: { count: 5 }
            },
            legend: { position: 'top' },
            // bar: { groupWidth: '30%' },
            animation: {
                duration: 1000,
                easing: 'out',
                startup: true
            },
            annotations: {
                alwaysOutside: true,
                textStyle: {
                    fontSize: 12,
                    auraColor: 'none',
                    color: '#555'
                }
            },
            width: 1100,
        };

        const options7 = {
            'title': 'Solved Problems Rating',
            vAxis: {
                minValue: 0,
                // gridlines: { count: 4 }
            },
            legend: { position: 'top' },
            // bar: { groupWidth: '45%' },
            animation: {
                duration: 1000,
                easing: 'out',
                startup: true
            },
            annotations: {
                alwaysOutside: true,
                textStyle: {
                    fontSize: 12,
                    auraColor: 'none',
                    color: '#555'
                }
            },
            width: 1900,
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

        let ratingData = [['Rating', user1.handle, { role: 'annotation' }, user2.handle, { role: 'annotation' }]];
        for (let i = 800; i <= 4000; i += 100) {
            const temp = [i, rating1.get(i) || 0, rating1.get(i) || 0, rating2.get(i) || 0, rating2.get(i) || 0]

            if (temp[1] || temp[2]) {
                ratingData.push(temp);
            }
        }

        const data7 = google.visualization.arrayToDataTable(ratingData);

    }
    if (submission1 && submission2 && user1 && user2 && contestList) drawTriedSolvedChart();
}, [submission1, submission2, user1, user2, contestList]);



return (
    <>
        <Box
            className="bg-gradient-to-t from-[#09203f] to-[#537895] font-sans min-h-screen">
            <Box className="flex flex-col items-center" pt={4}>
                <Typography
                    variant="h3"
                    mt={6}
                    mb={3}
                    fontWeight={900}
                    fontSize={31}
                >Codeforces Profile Analyzer
                </Typography>

                <Typography
                    variant="p"
                    mb={2}
                    fontWeight={500}
                >Enter Codeforces Handle
                </Typography>

                <Box className="flex gap-4 mb-4 justify-around flex-col md:flex-row">
                    <TextField
                        required
                        id="outlined-required"
                        defaultValue={handle1}
                        onChange={(e) => setHandle1(e.target.value)}
                    />

                    <TextField
                        required
                        id="outlined-required"
                        defaultValue={handle2}
                        onChange={(e) => setHandle2(e.target.value)}
                    />
                </Box>
                {error && <p className="text-red-600 mb-4">{error}</p>}

                {/* Button From Material UI */}
                <Button
                    onClick={fetchUserData}
                    variant="contained"
                    color="success"
                    size="large"
                    sx={{ px: 5 }}
                >Fetch</Button>
            </Box>

            {/* All chart parent div */}
            {isVisible && <div className="flex flex-col mt-10 gap-4">

                <Box className="flex justify-center lg:justify-around flex-col mx-3 lg:flex-row">
                    <Paper
                        elevation={5}
                        id="ratingChart"
                        className="h-80 md:w-3/5  shadow-lg "
                    ></Paper>

                    <Paper
                        elevation={5}
                        id="contestChart"
                        className="h-80 rounded-lg shadow-lg"
                    ></Paper>
                </Box>

                <Box className="flex justify-center rounded-lg">
                    <Paper
                        elevation={5}
                        id="ratingChange"
                        className="h-72 md:w-3/5 md:h-96 rounded-lg shadow-lg"
                    ></Paper>
                </Box>

                <Box className="flex justify-center rounded-lg">
                    <Paper
                        elevation={5}
                        id="bestWorstRank"
                        className="h-32 w-screen md:w-2/3 my-2 mx-7 rounded-lg shadow-lg"
                    ></Paper>
                </Box>

                <Box className="flex justify-center rounded-lg">
                    <Paper
                        elevation={5}
                        id="timeline"
                        className="h-64 w-screen md:w-4/5 md:h-80 my-2 mx-5 shadow-lg rounded-lg"
                    ></Paper>
                </Box>

                <Box className="flex flex-col flex-wrap lg:flex-row justify-around gap-2 mx-7 rounded-lg">
                    <Paper
                        elevation={5}
                        id="triedSolved"
                        className="h-80 md:w-1/3 my-2 shadow-lg rounded-lg"
                    ></Paper>

                    <Paper
                        elevation={5}
                        id="unSolved"
                        className="h-80 md:w-1/3 my-2 shadow-lg rounded-lg"
                    ></Paper>

                    <Paper
                        elevation={5}
                        id="averageSubmission"
                        className="h-80 md:w-1/3 my-2 shadow-lg rounded-lg"
                    ></Paper>
                </Box>

                <Box className="flex justify-around py-2 flex-col lg:flex-row mx-7 rounded-lg">
                    <Paper
                        elevation={5}
                        id="maxSubmission"
                        className="h-80 my-2 shadow-lg rounded-lg"
                    ></Paper>

                    <Paper
                        elevation={5}
                        id="singleSubmission"
                        className="h-80 my-2 shadow-lg rounded-lg"
                    ></Paper>
                </Box>

                <Box className="flex justify-center overflow-x-auto mx-7 rounded-lg">
                    <Paper
                        elevation={5}
                        id="level"
                        className="h-96 my-3 w-screen md:w-4/5 shadow-lg rounded-lg"
                    ></Paper>
                </Box>

                {/* <Box className="flex justify-center overflow-x-auto mx-7 rounded-lg">
                    <Paper
                        elevation={5}
                        id="rating"
                        className="h-96 my-3 w-screen md:w-4/5 shadow-lg rounded-lg"
                    ></Paper>
                </Box> */}

            </div>}
        </Box>
    </>
);

};

export default CodeforcesProfileCompare;
