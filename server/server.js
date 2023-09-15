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

function getCoordinates(car, progress)
{
  if (progress < 250) {
    x = 0
    y = progress
  } else if (progress < 500) {
    x = progress-250
    y = 250
  } else if (progress < 750) {
    x = 250
    y = (0-progress)+750
  } else {
    x = (0-progress)+1000
    y = 0
  }

  return {
    'car': car,
    'x': x,
    'y': y
  }
}

function getCarProgress(car, progress)
{
  let carprogress = progress+car*20;

  if (carprogress >= 1000) {
    return carprogress-1000;
  }

  return carprogress;
}

//Listen for WebSocket connections
websocketServer.on('connection', (socket) => {
    // Log a message when a new client connects
    console.log('client connected.');
    // Listen for incoming WebSocket messages
    socket.on('message', (data) => {
  
     // Broadcast the message to all connected clients
      websocketServer.clients.forEach(function each(client) {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          client.send(data.toString());
          // console.log("message",data.toString())
        }
      });
    });
    // Listen for WebSocket connection close events
    socket.on('close', () => {
      // Log a message when a client disconnects
      console.log('Client disconnected');
    });



    var progress = 0;

    setInterval(() => {
      websocketServer.clients.forEach(function each(client) {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          for (let car = 0; car<20; car++) {
            client.send(JSON.stringify(
              getCoordinates(car, getCarProgress(car, progress))
            ))
            progress++;

            if (progress > 1000) {
              progress = 0;
            }
          }
        }
      });
    }, 50);
  });