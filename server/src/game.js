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

exports.getPlayerData = function(game) {
    var pn = [];
    for(const [i, p] of game.players.entries()){
        pn.push({
            name : p.name,
            cash : p.cash
        });
    }
    return pn;
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
