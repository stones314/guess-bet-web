const player = require("./player");
const consts = require("./consts");

exports.create = function(gid, quiz, hostConn) {
    var game = {
        colors : [ '50bde3', '80ffe3', '3cb44b', '4363d8', '8f7c31', 'aaffc3', 'bdbdbd', "dcbeff",
         "e14eff", "e3d055", "e6194b", "fabed4", "ff9a00", "fffac8", "ffe119" ],
        gid : gid,
        quiz : quiz,
        hostConn : hostConn,
        state : -1,
        players : [],
        betOpts : [],
        correct : -1,
    }

    //randomize colors
    game.colors.sort(function(a,b) { return Math.random() > 0.5; } );
    return game;
}

exports.addPlayer = function(game, name, res) {
    for(const [i, p] of game.players.entries()){
        if(p.name === name){
            console.log("player " + name + " already exists");
            return false;
        }
    }
    game.players.push(player.create(name, res, game.colors.pop()));
    return true;
}

exports.removePlayer = function(game, name) {
    for(const [i, p] of game.players.entries()){
        if(p.name === name){
            game.colors.push(p.color);
            game.players.splice(i, 1);
            return true;
        }
    }
    return false;
}

exports.hasPlayer = function(game, name) {
    for(const [i, p] of game.players.entries()){
        if(p.name === name){
            return true;
        }
    }
    return false;
}

exports.step = function(game) {
    var wrap = game.state === consts.GameState.SHOW_STANDINGS;
    game.state += 1;
    game.state %= 5;
    if(wrap){
        game.quiz.pos += 1;
        if (game.quiz.pos == game.quiz.questions.length) game.state = consts.GameState.GAME_OVER;
        game.players.forEach(p => {
            player.resetInput(p)
        });
    }
    return game.state;
}

exports.getPlayer = function(game, name){
    for(const [i, p] of game.players.entries()){
        if(p.name === name) return p;
    }
    return null;
}

exports.getPlayerData = function(game) {
    var pn = [];
    for(const [i, p] of game.players.entries()){
        pn.push({
            name : p.name,
            cash : p.cash,
            color: p.color,
            ans : p.ans,
            bet : p.bet,
            won : p.won
        });
    }
    return pn;
}

exports.setAns = function(game, pname, ans) {
    for(const [i, p] of game.players.entries()){
        if(p.name === pname){
            p.ans = ans;
            return true;
        }
    }
    return false;
}

exports.computeBetOpts = function(game) {
    var bo = [{min: -12345678, others: 0, odds : 2, correct : false}]; //this is the "lower than any provided answers" option

    //Add player options
    for(const [i, p] of game.players.entries()){
        const ans_at = bo.indexOf(p.ans);
        if(ans_at < 0){
            bo.push({min : p.ans, others : 0, odds : 2, correct : false});
        }
        else{
            bo[ans_at].others += 1;
        }
    }
    bo.sort((a, b) => a.min - b.min);

    function reduceAt(i){
        bo[i-1].others += bo[i].others + 1;
        bo.splice(i,1);
    }
    
    // logic to reduce number of options
    // by removing the smallest intevalls
    while (bo.length > 8){//There will be at most 8 bet-options
        var minDelta = bo[2].min - bo[1].min;
        var mId = 2;    //never want to remove lowest player value at 1, so start at 2
        for(var i = 3; i < bo.length; i++){
            var delta = bo[i].min - bo[i-1].min;
            if(delta < minDelta){
                minDelta = delta;
                mId = i;
            }
        }
        //If the shortest intevall is at one of the ends we remove the option that 
        //is next to that end
        if(mId === 2) {
            reduceAt(2);
        }
        else if(mId === bo.length - 1) {
            reduceAt(bo.length - 2);
        }
        //Otherwise we remove the edge of the shortest intevall such that the shortest of the 
        //neighbouring intevalls get expanded
        else if(bo[mId+1].min - bo[mId].min > bo[mId-1].min - bo[mId-2].min){
            reduceAt(mId - 1);
        }
        else {
            reduceAt(mId);
        }
    }
    // Find correct:
    const ans = Number.parseFloat(game.quiz.questions[game.quiz.pos].answer);
    game.correct = -1;
    for (const [i, o] of bo.entries()) {
        o.odds = consts.OddsDist[bo.length - 3][i];
        if(o.min <= ans)game.correct++;
    }
    bo[game.correct].correct = true;
    console.log(bo);
    console.log("a: " + ans);
    console.log("p: " + game.quiz.pos);
    game.betOpts = bo;
}

exports.setBet = function(game, pname, bet) {
    for(const [i, p] of game.players.entries()){
        if(p.name === pname){
            p.bet = bet;
            p.bet.forEach(b => {
                p.cash -= b.val;
            });
            return true;
        }
    }
    return false;
}

exports.calculateResults = function(game) {
    const odds = game.betOpts[game.correct].odds;
    for(const [i, p] of game.players.entries()){
        p.won = 2;//always get two coins back!
        p.bet.forEach(bet => {
           if(bet.opt === game.correct) p.won += bet.val * odds;
        });
        p.cash += p.won;
    }
}

exports.getWinnings = function(game, pname) {
    for(const [i, p] of game.players.entries()){
        if(p.name === pname) return p.won;
    }
    return 0;
}