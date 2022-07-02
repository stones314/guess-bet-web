const pModule = require("./player");

exports.create = function(id, quiz, hostConn) {
    var game = {
        id : id,
        quiz : quiz,
        hostConn : hostConn,
        state : 0,
        players : []
    }
    return game;
}

exports.addPlayer = function(game, name, res) {
    for(const [i, p] of game.players.entries()){
        if(p.name === name){
            console.log("player " + name + " already exists");
            return false;
        }
    }
    game.players.push(pModule.create(name, res));
    return true;
}

exports.removePlayer = function(game, name) {
    for(const [i, p] of game.players.entries()){
        if(p.name === name){
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
    game.state += 1;
    game.state %= 6;
    return true;
}

exports.getPlayerData = function(game) {
    var pn = [];
    for(const [i, p] of game.players.entries()){
        pn.push({
            name : p.name,
            cash : p.cash,
            ans : p.ans,
            bet : p.bet
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

exports.getBetOpts = function(game) {
    var bo = [{min: -12345678, others: 0}]; //this is the "lower than any provided answers" option

    //Add player options
    for(const [i, p] of game.players.entries()){
        bo.push({min : p.ans, others : 0});
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
    return bo;
}

exports.setBet = function(game, pname, bet) {
    for(const [i, p] of game.players.entries()){
        if(p.name === pname){
            p.bet = bet;
            return true;
        }
    }
    return false;
}

