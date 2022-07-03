exports.GameState = {
    LOADING : -2,
    WAIT_FOR_PLAYERS : -1,
    WAIT_FOR_ANSWERS : 0,
    WAIT_FOR_BETS : 1,
    SHOW_BETS : 2,
    SHOW_CORRECT : 3,
    SHOW_STANDINGS : 4,
    GAME_OVER : 5,
};

exports.OddsDist = [
    [3,2,3],
    [4,3,2,3],
    [4,3,2,3,4],
    [5,4,3,2,3,4],
    [5,4,3,2,3,4,5],
    [6,5,4,3,2,3,4,5]
];