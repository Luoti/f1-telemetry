// own custom mocks
const { mocks } = require('./mocks/2023');
const { F1TelemetryClient, constants } = require('./node_modules/@racehub-io/f1-telemetry-client');
const { PACKETS } = constants;
const Parser = require('./Libs/Parser');

// import { F1TelemetryClient, constants } from "f1-telemetry-client";

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
// Create an Express app instance
const app = express();
// Create an HTTP server using the Express app instance
const server = http.createServer(app);
// Create a WebSocket server instance and attach it to the HTTP server
const websocketServer = new WebSocket.Server({ server });
// Start the server listening on port 3000
server.listen(3000, () => {
  console.log("Websocket server started on port 3000");
});

// F1 client
const f1Client = new F1TelemetryClient({ port: 20777 });

// to start listening:
f1Client.start();

// Listen for WebSocket connections
websocketServer.on('connection', (socket) => {
  // Log a message when a new client connects
  console.log('client connected.');


  // Listen for incoming WebSocket messages
  socket.on('message', (data) => {

    let message = data.toString();

    if (message === 'participants') {
      socket.send(JSON.stringify(Parser.parseParticipants(mocks.participants)));
    } else if (message === 'motion') {
      socket.send(JSON.stringify(Parser.parseMotion(mocks.motion)));
    } else if (message === 'session') {
      socket.send(JSON.stringify(Parser.parseSession(mocks.session)));
    } else if (message === 'lapdata1') {
      socket.send(JSON.stringify(Parser.parseLapData(mocks.lapData1)));
    } else if (message === 'lapdata2') {
      socket.send(JSON.stringify(Parser.parseLapData(mocks.lapData2)));
    }
    // Broadcast the message to all connected clients
    // websocketServer.clients.forEach(function each(client) {
    //   if (client !== socket && client.readyState === WebSocket.OPEN) {
    //     client.send(data.toString());
    //     // console.log("message",data.toString())
    //   }
    // });
  });
  // Listen for WebSocket connection close events
  socket.on('close', () => {
    // Log a message when a client disconnects
    console.log('Client disconnected');
  });

  
  // f1Client.on(PACKETS.event, console.log);
  f1Client.on(PACKETS.motion, function(data) {
    socket.send(JSON.stringify(Parser.parseMotion(data)))
  });
  // f1Client.on(PACKETS.carSetups, console.log);
  f1Client.on(PACKETS.lapData, function(data) {
    socket.send(JSON.stringify(Parser.parseLapData(data)))
  });
  f1Client.on(PACKETS.session, function(data) {
    socket.send(JSON.stringify(Parser.parseSession(data)))
  });
  f1Client.on(PACKETS.participants, function(data) {
    socket.send(JSON.stringify(Parser.parseParticipants(data)))
  });
  // f1Client.on(PACKETS.carTelemetry, console.log);
  // f1Client.on(PACKETS.carStatus, console.log);
  // f1Client.on(PACKETS.finalClassification, console.log);
  // f1Client.on(PACKETS.lobbyInfo, console.log);
  // f1Client.on(PACKETS.carDamage, console.log);
  // f1Client.on(PACKETS.sessionHistory, console.log);
  // f1Client.on(PACKETS.tyreSets, console.log);
  // f1Client.on(PACKETS.motionEx, console.log);
});

// f1Client.stop();
