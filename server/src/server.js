"use strict";
const game = require("./game");

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-chat';

// Port where we'll run the websocket server
var webSocketsServerPort = 1337;

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');

/**
 * Global variables
 */
var quizlist = [ ];
var games = {};

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
  console.log((new Date()) + " Server is listening on port "
      + webSocketsServerPort);
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
  console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
  
  // accept connection - you should check 'request.origin' to
  // make sure that client is connecting from your website
  // (http://en.wikipedia.org/wiki/Same_origin_policy)
  var connection = request.accept(null, request.origin);

  // we need to know client index to remove them on 'close' event
  var name = false;
  var color = false;
  var gid = false;          //unique game id this user is related to
  var role = 0;         //0: undefined, 1: host, 2: player
  console.log((new Date()) + ' Connection accepted.');
    
  // user sent some message
  connection.on('message', function(message) {
    if (message.type !== 'utf8') { return; }// accept only text
    
    const data = JSON.parse(message.utf8Data);

    if(data.type === "host-game"){
        gid = Math.floor(Math.random() * 10000000);
        games[gid] = game.create(gid, quizlist[data.quizId], connection);
        connection.sendUTF(
            JSON.stringify({type : "host-game", ok : ok})
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
        return;
    }
    if(gid === false) { return; }   //Must have a gid to process any other message

    //TODO: impl other message types!
  });
  
  // user disconnected
  connection.on('close', function(connection) {
    if (role === 1) {
      console.log((new Date()) + " Host " + connection.remoteAddress + " disconnected.");
      games[gid].players.forEach(player => player.sendUTF(
        JSON.stringify({type : "end-game"})
      ));
      delete games.container[gid];
    }
    else if (role === 2) {
        console.log((new Date()) + " " + name + " (" + connection.remoteAddress + ") disconnected.");
        games[gid].hostConn.sendUTF(
          JSON.stringify({type : "left-game", name : name})
        );
        games[gid].removePlayer(name);
      }
  });
});

