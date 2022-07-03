//server/src/index.js
const express = require("express");
const bodyParser = require("body-parser");
const game = require("./game");
const cors = require("cors");
const consts = require("./consts");

var corsOptions = {
  origin: 'https://rygg-gaard.no',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

///////////////////////////////////////
// Express stuff
// used for normal fetch requests from client
///////////////////////////////////////
const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

// Process application/json
app.use(bodyParser.json());

var quizlist = [];
var games = {};

/*
 * load-quiz-list
 * 
 * Res data:
 *  quizlist     array of name and length
 * 
 */
app.post("/load-quiz-list", (req, res) => {
  var infoList = [];
  for(var i = 0; i < quizlist.length; i++){
    infoList.push({
      name : quizlist[i].name,
      length : quizlist[i].questions.length
    });
  }
  console.log("Load quiz-list : " + infoList.length + " from " + quizlist.length);
  res.json({ quizlist: infoList });
});

/*
 * load-quiz
 *
 * Req data:
 *  data.index   index of quiz
 * 
 * Res data:
 *  quiz         object with name and questions
 * 
 */
app.post("/load-quiz", (req, res) => {
  var data = req.body;
  console.log("Load quiz : " + quizlist[data.index].name);
  res.json({ quiz : quizlist[data.index] });
});

/*
 * save-quiz
 *
 * Req data:
 *  data.name   name of quiz
 * 
 * Res data:
 *  message     a message
 * 
 */
app.post("/save-quiz", (req, res) => {
  var data = req.body;
  var id = -1;
  for(var i = 0; i < quizlist.length; i++){
    if(quizlist[i].name === data.name){
      id = i;
      break;
    }
  }
  if(id >= 0){
    quizlist[id] = data;
  }
  else {
    quizlist.push(data);
  }
  console.log(data);
  res.json({ message: "Quiz Saved!" });
});

/*
 * delete-quiz
 *
 * Req data:
 *  data.index  index of quiz in quizlist
 * 
 * Res data:
 *  message     a message...
 * 
 */
app.post("/delete-quiz", (req, res) => {
  var data = req.body;
  quizlist.splice(data.index,1);
  console.log("deleted at " + data.index);
  res.json({ message: "Quiz Deleted!" });
});

/*
 * can-join-quiz
 *
 * Req data:
 *  data.gid  game id
 *  data.name player name
 * 
 * Res data:
 *  ok     1 = ok, 2 = invalid gid, 3 = name in use
 * 
 */
app.post("/can-join-quiz", (req, res) => {
  const data = req.body;
  var ok = 1;
  var text = "OK";
  if(!(data.gid in games)){
    ok = 2;
    text = "INVALID GID";
  }
  else if(game.hasPlayer(games[data.gid], data.name)){
    ok = 3;
    text = "NAME USED";
  }
  //console.log("Player " + data.name + " joining " + data.gid + " = " + text);
  res.json({ ok: ok });
});

//
// LISTEN!
//
app.listen(PORT, () => {
  console.log(`Express Server listening on ${PORT}`);
});


/////////////////////////////////////////
// WebSocket Stuff!
// Used to let server notify clients when something has happened
/////////////////////////////////////////
"use strict";

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-chat';

// Port where we'll run the websocket server
var webSocketsServerPort = 1337;

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');

/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {
  // Not important for us. We're writing WebSocket server,
  // not HTTP server
});
server.listen(webSocketsServerPort, function() {
  console.log("Web Socket Server is listening on port " + webSocketsServerPort);
});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
  // WebSocket server is tied to a HTTP server. WebSocket
  // request is just an enhanced HTTP request. For more info 
  // http://tools.ietf.org/html/rfc6455#page-6
  httpServer: server
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
  //console.log(' Connection from origin ' + request.origin + '.');
  
  // accept connection - you should check 'request.origin' to
  // make sure that client is connecting from your website
  // (http://en.wikipedia.org/wiki/Same_origin_policy)
  var connection = request.accept(null, request.origin);

  // we need to know client index to remove them on 'close' event
  var name = false;
  var color = false;
  var gid = false;      //unique game id this user is related to
  var role = 0;         //0: undefined, 1: host, 2: player
  //console.log(' Connection accepted.');
    
  // user sent some message
  connection.on('message', function(message) {
    if (message.type !== 'utf8') { return; }// accept only text
    
    const data = JSON.parse(message.utf8Data);

    //Host create game:
    if(data.type === "host-game"){
      gid = Math.floor(Math.random() * 10000000);
        games[gid] = game.create(gid, quizlist[data.quizId], connection);
        connection.sendUTF(
            JSON.stringify({type : "host-game", gid : gid, quiz : quizlist[data.quizId]})
        );
        role = 1;
        console.log("["+gid+"] Host started new game");
        return;
    }

    //Player join game:
    if(data.type === "join-game"){
        gid = data.gid;
        role = 2;
        name = data.name;
        const ok = game.addPlayer(games[gid], name, connection);
        games[gid].hostConn.sendUTF(
            JSON.stringify({type : "join-game", data : game.getPlayerData(games[gid])})
        );
        connection.sendUTF(
            JSON.stringify({type : "join-game", ok : ok})
        );
        console.log("["+gid+"] Player Joined Game");
        return;
    }

    if(gid === false) { return; }   //Must have a gid to process any other message

    //Host step  game:
    if(data.type === "step-game"){
      const newState = game.step(games[gid]);
      games[gid].hostConn.sendUTF(
          //Notify host about latest player state and new game state
          JSON.stringify({
            type : "step-game",
            data : game.getPlayerData(games[gid]),
            newState : newState
          })
      );
      if(newState === consts.GameState.WAIT_FOR_ANSWERS){
        games[gid].players.forEach(player => player.conn.sendUTF(
          //Tell Player to provide an answer
          JSON.stringify({type : "req-ans"})
        ));
      }
      if(newState === consts.GameState.WAIT_FOR_BETS){
        //Tell both Host and Player about bet options, and request bet from player
        game.computeBetOpts(games[gid]);
        games[gid].hostConn.sendUTF(
          JSON.stringify({
            type : "bet-opts",
            betOpts : games[gid].betOpts
          })
        );
        games[gid].players.forEach(player => player.conn.sendUTF(
          JSON.stringify({type : "req-bets", betOpts : games[gid].betOpts})
        ));
      }
      if(newState === consts.GameState.SHOW_CORRECT){
        //Tell players how much they won
        game.calculateResults(games[gid]);
        games[gid].players.forEach(player => player.conn.sendUTF(
          JSON.stringify({type : "winnings", won : game.getWinnings(games[gid], name)})
        ));
      }
      console.log("["+gid+"] Game Stepped to " + newState);
      return;
    }

    //Player suggest an answer:
    if(data.type === "send-ans"){
      game.setAns(games[gid], name, data.ans);
      games[gid].hostConn.sendUTF(
        JSON.stringify({
          type : "player-ans",
          data : game.getPlayerData(games[gid]),
        })
      );
      console.log("["+gid+"] Player " + name + "sent ans");
      return;
    }

    //Player placed bet:
    if(data.type === "send-bet"){
      game.setBet(games[gid], name, data.bet);
      games[gid].hostConn.sendUTF(
        JSON.stringify({
          type : "player-bet",
          data : game.getPlayerData(games[gid]),
        })
      );
      console.log("["+gid+"] Player " + name + "sent bet");
      return;
    }
  });
  
  // user disconnected
  connection.on('close', function(connection) {
    if (role === 1) {
      //Host diconnect
      console.log("["+gid+"] Host disconnected.");
      games[gid].players.forEach(player => player.conn.sendUTF(
        JSON.stringify({type : "end-game"})
      ));
      delete games[gid];
    }
    else if (role === 2) {
        //Player diconnect
        console.log("["+gid+"] " + name + " disconnected.");
        if(gid in games){
          game.removePlayer(games[gid], name);
          games[gid].hostConn.sendUTF(
            JSON.stringify({type : "left-game", data : game.getPlayerData(games[gid])})
          );
        }
    }
    else {
      console.log("Unknown client disconnected.");
    }
  });
});

