export function bestWorstRank(ratingList) {
    //returns an array - [BestRank, WorstRank]
    let rank = [1000000, 1];
    ratingList.forEach(element => {
        rank[0] = Math.min(rank[0], element.rank);
        rank[1] = Math.max(rank[1], element.rank);
    });
    return rank;
}

export function maxRatingChange(ratingList) {
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

export function drawRatingChart(user1, user2, rating1, rating2) {
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
