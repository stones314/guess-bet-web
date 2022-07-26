//server/src/index.js
const express = require("express");
const bodyParser = require("body-parser");
const game = require("./game");
const player = require("./player");
const user = require("./user");
const cors = require("cors");
const consts = require("./consts");
const fs = require("fs");

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

var quizlist = {};
var games = {};
var users = {};

/*
 * Load saved quizes from file:
 */
const qfiles = fs.readdirSync("quizes/");

qfiles.forEach(fname => {
  var data = fs.readFileSync("quizes/"+fname, "utf-8", (err, data) => {
    if(err){
      console.log("ERR? " + err);
      throw err;
    }
  });
  quizlist["quizes/" + fname] = JSON.parse(data.toString());
});

/*
 * Load users from file:
 */
const ufiles = fs.readdirSync("users/");

ufiles.forEach(fname => {
  var data = fs.readFileSync("users/"+fname, "utf-8", (err, data) => {
    if(err){
      console.log("ERR? " + err);
      throw err;
    }
  });
  users[fname] = JSON.parse(data.toString());
});

/*
 * log-in
 * 
 * Req data:
 *  user    user name
 *  pwd     password
 * 
 * Res data:
 *  ok     0: wrong pwd, 1: ok logged in, 2: ok new user created
 * 
 */
app.post("/log-in", (req, res) => {
  const data = req.body;
  var ok = 1;
  if(Object.keys(users).includes(data.user)){
    if(users[data.user].pwd !== data.pwd){
      ok = 0;
    }
    else{
      users[data.user].lastLogin = Date();
    }
  }
  else {
    ok = 2;
    users[data.user] = user.create(data.user, data.pwd);
  }
  if(ok > 0){
    fs.writeFile("users/" + data.user, JSON.stringify(users[data.user]), (err) => {
      if(err){
        console.log("user save to file error");
        throw err;
      }
    })
  }
  res.json({ ok: ok });
});

/*
 * load-quiz-list
 *
 * Req data:
 *  data.user        user name
 * 
 * Res data:
 *  quizlist     array of name and length
 * 
 */
app.post("/load-quiz-list", (req, res) => {
  const data = req.body;
  var infoList = [];
  if(!Object.keys(users).includes(data.user)){
    res.json({ok: false, quizlist: infoList});
    return;
  }
  for(const [i, q] of users[data.user].quizes.entries()){
    const quiz = quizlist[q];
    infoList.push({
      name : quiz.name,
      length : quiz.questions.length,
      file : quiz.file
    });
  }
  console.log("Load quiz-list for " + data.user + ", length : " + infoList.length);
  res.json({ ok: true, quizlist: infoList });
});

/*
 * load-quiz
 *
 * Req data:
 *  data.user  user name
 *  data.file   file name ( === quiz id )
 * 
 * Res data:
 *  ok           if ok or not
 *  quiz         object with name and questions
 * 
 */
app.post("/load-quiz", (req, res) => {
  var data = req.body;
  if(!Object.keys(users).includes(data.user)){
    console.log("load quiz: unknown user " + data.user);
    res.json({ok: false, quiz: undefined});
    return;
  }
  if(!Object.keys(quizlist).includes(data.file)){
    console.log("load quiz: unknown file " + data.file);
    res.json({ok: false, quiz: undefined});
    return;
  }
  
  console.log("load quiz " + data.file + " for " + data.user);
  res.json({ok: true, quiz : quizlist[data.file] });
});

/*
 * save-quiz
 *
 * Req data:
 *  data.user   user name
 *  data.name   name of quiz
 * 
 * Res data:
 *  message     a message
 * 
 */
app.post("/save-quiz", (req, res) => {
  var data = req.body;
  if(!Object.keys(users).includes(data.user)){
    res.json({ok: false, message: "unknown user"});
    return;
  }
  var id = -1;
  if(data.file === "") {
    var x = Math.floor(Math.random() * 10000000000);
    data.file = "quizes/Q"+x+".json";
    users[data.user].quizes.push(data.file);
  }

  quizlist[data.file] = data;

  fs.writeFile(data.file, JSON.stringify(data), (err) => {
    if(err){
      console.log("quiz save to file error");
      throw err;
    }
  })

  fs.writeFile("users/" + data.user, JSON.stringify(users[data.user]), (err) => {
    if(err){
      console.log("user save to file error");
      throw err;
    }
  })

  res.json({ message: "Quiz Saved!" });
});

/*
 * delete-quiz
 *
 * Req data:
 *  data.user   user name
 *  data.file   quiz file to be deleted
 * 
 * Res data:
 *  message     a message...
 * 
 */
app.post("/delete-quiz", (req, res) => {
  var data = req.body;
  console.log("delete-quiz: user " + data.user + ", file: " + data.file);
  if(!Object.keys(users).includes(data.user)){
    console.log("delete-quiz: unknown user " + data.user);
    res.json({ok: false, message: "unknown user"});
    return;
  }
  for(const [i, q] of users[data.user].quizes.entries()){
    if(q === data.file){
      users[data.user].quizes.splice(i, 1);
      fs.unlink(data.file, (err) => {if(err)throw err;});
      delete quizlist[data.file];
      break;
    }
  }
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
      gid = 100000 + Math.floor(Math.random() * 899999);
      games[gid] = game.create(gid, JSON.parse(JSON.stringify(quizlist[data.file])), connection);
        
      connection.sendUTF(
        JSON.stringify({type : "host-game", gid : gid, quiz : games[gid].quiz})
      );
      role = 1;
      console.log("["+gid+"] Host started new game, nr " + Object.keys(games).length);
      
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
        const p = game.getPlayer(games[gid], name);
        const q = games[gid].quiz.questions[games[gid].quiz.pos];
        if(ok === 1){
          player.sendGameState(p, q, games[gid].betOpts, games[gid].state, "connect");
          console.log("["+gid+"] "+ name +" Joined Game :)");
        }
        else if(ok === 2) {
          player.sendGameState(p, q, games[gid].betOpts, games[gid].state, "connect");
          console.log("["+gid+"] "+ name +" Reconnected :) ");
        }
        else{
          console.log("["+gid+"] "+ name +" error at Join Game ! ");  
        }
        return;
    }

    if(gid === false) { return; }   //Must have a gid to process any other message

    //Host step  game:
    if(data.type === "step-game"){
      game.step(games[gid]);
      game.notifyNewState(games[gid]);
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

      if(game.allPlayersResponded(games[gid])){
        game.step(games[gid]);
        game.notifyNewState(games[gid]);
      }
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

      if(game.allPlayersResponded(games[gid])){
        game.step(games[gid]);
        game.notifyNewState(games[gid]);
      }
      return;
    }
  });
  
  // user disconnected
  connection.on('close', function(connection) {
    if (role === 1) {
      //Host diconnect
      console.log("["+gid+"] Host disconnected.");
      games[gid].players.forEach(p => player.sendHostDied(p,games[gid].state));
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

