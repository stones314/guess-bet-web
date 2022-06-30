const player = require("./player");

exports.create = function(id, quiz, hostConn) {
    this.id = id;
    this.quiz = quiz;
    this.hostConn = hostConn;
    this.state = 0;
    this.players = [];
    return this;
}

exports.getPlayerData = function() {
    var pn = [];
    for(const [i, p] of this.players.entries()){
        pn.push({
            name : p.name,
            cash : p.cash
        });
    }
    return pn;
}

exports.addPlayer = function(name, res) {
    for(const [i, p] of this.players.entries()){
        if(p.name === name) return false;
    }
    this.players.push[player.create(name, res)];
    return true;
}

exports.removePlayer = function(name) {
    for(const [i, p] of this.players.entries()){
        if(p.name === name){
            this.players.splice(i, 1);
            return true;
        }
    }
    return false;
}

exports.hasPlayer = function(name) {
    for(const [i, p] of this.players.entries()){
        if(p.name === name){
            return true;
        }
    }
    return false;
}

exports.step = function() {
    this.state += 1;
    this.state %= 6;
    return true;
}
