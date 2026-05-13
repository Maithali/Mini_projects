const WebSocket = require("ws");

// Create WebSocket server
const wss = new WebSocket.Server({ port: 3000 });

console.log("WebSocket server running on ws://localhost:3000");

// On connection
wss.on("connection", (ws) => {
  console.log("Client connected");

  // Receive message
  ws.on("message", (message) => {
    console.log("Received:", message.toString());

    // Send response back
    ws.send(`Server received: ${message}`);
  });

  // Send initial message
  ws.send("Welcome to WebSocket server!");

  // Handle close
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});