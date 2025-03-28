export const  maxRatingChange = (ratingList) => {
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

export const bestWorstRank = (ratingList) => {
    //returns an array - [BestRank, WorstRank]
    let rank = [1000000, 1];
    ratingList.forEach(element => {
        rank[0] = Math.min(rank[0], element.rank);
        rank[1] = Math.max(rank[1], element.rank);
    });
    return rank;
}