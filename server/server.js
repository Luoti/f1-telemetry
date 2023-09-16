// own custom mocks
const { mocks } = require('./mocks/2023');
const { F1TelemetryClient, constants } = require('./node_modules/@racehub-io/f1-telemetry-client');
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

function parseParticipants(data) {
  let response = {
    'packetID': data.packetID,
    'data' : []
  };
  for (const participant in data.parsed.m_participants) {
    response.data.push({
      'ai': data.parsed.m_participants[participant].m_aiControlled,
      'driver': constants.DRIVERS[data.parsed.m_participants[participant].m_driverId]?.abbreviation ?? '',
      'name': data.parsed.m_participants[participant].m_name,
      // 'nationality': constants.NATIONALITIES[data.parsed.m_participants[participant].m_nationality],
      'number': data.parsed.m_participants[participant].m_raceNumber,
      'team': constants.TEAMS[data.parsed.m_participants[participant].m_teamId]?.name ?? '',
      'color': constants.TEAMS[data.parsed.m_participants[participant].m_teamId]?.color ?? ''
    });
  }

// console.log(response);

  return response
}

// Listen for WebSocket connections
websocketServer.on('connection', (socket) => {
    // Log a message when a new client connects
    console.log('client connected.');
    // Listen for incoming WebSocket messages
    socket.on('message', (data) => {
  
      let message = data.toString();

      if (message === 'participants') {
        socket.send(JSON.stringify(parseParticipants(mocks.participants)));
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


  