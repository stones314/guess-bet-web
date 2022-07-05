const consts = require("./consts");
const { getPlayerData } = require("./game");

exports.create = function(name, conn, color) {
    var p = {
        name : name,
        conn : conn,
        color: color,
        cash : 2,
        ans : consts.MIN_INF,//this value is used for Not Provided
        bet : [
            {
                opt : 0,
                val : 0
            },
            {
                opt : 0,
                val : 0
            }
        ],
        won : 0,
        online : true
    }
    return p;
}

exports.getPlayerData = function(p){
    return {
        name : p.name,
        cash : p.cash,
        color: p.color,
        ans : p.ans,
        bet : p.bet,
        won : p.won,
        online : p.online
    }
}

exports.resetInput = function(player) {
    player.ans = consts.MIN_INF;
    player.bet = [
        {
            opt : 0,
            val : 0
        },
        {
            opt : 0,
            val : 0
        }
    ];
    player.won = 0;
}

exports.sendHostDied = function(player) {
    if(!player.online) return;
    player.conn.sendUTF(
        JSON.stringify({type : "host-died"})
    )
}

exports.sendGameState = function(player, question, betOpts, state, type = "state-update"){
    if(!player.online) return;
    const p = {
        name : player.name,
        cash : player.cash,
        color: player.color,
        ans : player.ans,
        bet : player.bet,
        won : player.won,
        online : player.online
    }
    player.conn.sendUTF(
        JSON.stringify({
          type : type,
          state : state,
          player : p,
          question : question,
          betOpts : betOpts
        })
    )
}