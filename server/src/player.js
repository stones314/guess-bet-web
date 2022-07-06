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
        online : true,
        rank : 0
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
        online : p.online,
        rank : p.rank
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

exports.sendHostDied = function(player, state) {
    if(!player.online) return;
    player.conn.sendUTF(
        JSON.stringify({type : "host-died", state : state})
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
        online : player.online,
        rank : player.rank
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