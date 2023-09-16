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

  setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        for (let car = 0; car<20; car++) {
          // socket.send(JSON.stringify(
          //   getCoordinates(car, getCarProgress(car, progress))
          // ))
        }
      }
  }, 50);
});

// F1 client
const client = new F1TelemetryClient({ port: 20777 });
// client.on(PACKETS.event, console.log);
client.on(PACKETS.motion, console.log);
// client.on(PACKETS.carSetups, console.log);
// client.on(PACKETS.lapData, console.log);
client.on(PACKETS.session, console.log);
client.on(PACKETS.participants, console.log);
// client.on(PACKETS.carTelemetry, console.log);
// client.on(PACKETS.carStatus, console.log);
// client.on(PACKETS.finalClassification, console.log);
// client.on(PACKETS.lobbyInfo, console.log);
// client.on(PACKETS.carDamage, console.log);
// client.on(PACKETS.sessionHistory, console.log);
// client.on(PACKETS.tyreSets, console.log);
// client.on(PACKETS.motionEx, console.log);

// to start listening:
// client.start();

// and when you want to stop:
// client.stop();