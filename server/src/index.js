//server/src/index.js
const express = require("express");
const bodyParser = require("body-parser");
const game = require("./game");
const cors = require("cors");

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
app.get("/load-quiz-list", cors(corsOptions), (req, res) => {
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
app.post("/load-quiz", cors(corsOptions), (req, res) => {
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
app.post("/save-quiz", cors(corsOptions), (req, res) => {
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
app.post("/delete-quiz", cors(corsOptions), (req, res) => {
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
app.post("/can-join-quiz", cors(corsOptions), (req, res) => {
  const data = req.body;
  var ok = 1;
  if(!(data.gid in games)){
    ok = 2;
  }
  else if(games[data.gid].hasPlayer(data.name)){
    ok = 3;
  }
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


// Array with some colors
var colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];

// ... in random order
colors.sort(function(a,b) { return Math.random() > 0.5; } );

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
  console.log(' Connection from origin ' + request.origin + '.');
  
  // accept connection - you should check 'request.origin' to
  // make sure that client is connecting from your website
  // (http://en.wikipedia.org/wiki/Same_origin_policy)
  var connection = request.accept(null, request.origin);

  // we need to know client index to remove them on 'close' event
  var name = false;
  var color = false;
  var gid = false;          //unique game id this user is related to
  var role = 0;         //0: undefined, 1: host, 2: player
  console.log(' Connection accepted.');
    
  // user sent some message
  connection.on('message', function(message) {
    if (message.type !== 'utf8') { return; }// accept only text
    
    const data = JSON.parse(message.utf8Data);

    if(data.type === "host-game"){
      console.log('Host started new game');
      gid = Math.floor(Math.random() * 10000000);
        games[gid] = game.create(gid, quizlist[data.quizId], connection);
        connection.sendUTF(
            JSON.stringify({type : "host-game", gid : gid, quiz : quizlist[data.quizId]})
        );
        role = 1;
        return;
    }
    if(data.type === "join-game"){
        gid = data.gid;
        role = 2;
        name = data.name;
        const ok = games[gid].AddPlayer(name, connection);
        games[gid].hostConn.sendUTF(
            JSON.stringify({type : "join-game", name : name})
        );
        connection.sendUTF(
            JSON.stringify({type : "join-game", ok : ok})
        );
        console.log('Player Joined Game');
        return;
    }
    if(gid === false) { return; }   //Must have a gid to process any other message

    //TODO: impl other message types!
  });
  
  // user disconnected
  connection.on('close', function(connection) {
    if (role === 1) {
      console.log("Host " + connection.remoteAddress + " disconnected.");
      games[gid].players.forEach(player => player.conn.sendUTF(
        JSON.stringify({type : "end-game"})
      ));
      delete games[gid];
    }
    else if (role === 2) {
        console.log(name + " (" + connection.remoteAddress + ") disconnected.");
        games[gid].hostConn.sendUTF(
          JSON.stringify({type : "left-game", name : name})
        );
        games[gid].removePlayer(name);
    }
    else {
      console.log("Client " + connection.remoteAddress + " disconnected.");
    }
  });
});

