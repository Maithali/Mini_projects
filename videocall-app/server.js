// Import Express framework
const express = require("express");

// Create an Express application
const app = express();

// Create an HTTP server using Express app
const server = require("http").Server(app);

// Integrate Socket.io with the HTTP server
const io = require("socket.io")(server);

// Set EJS as the templating/view engine
app.set("view engine", "ejs");

// Serve static files from the "public" folder
app.use(express.static("public"));

// Handle GET request for home route
const ROOM_ID = "room1";

app.get("/", (req, res) => {
  res.render("index", {
    RoomId: ROOM_ID,
    message: "Welcome to GeeksforGeeks Video Call App",
  });
});

io.on("connection", (socket) => {
  socket.on("newUser", (id) => {
    socket.join(ROOM_ID);
    socket.to(ROOM_ID).broadcast.emit("userJoined", id);
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log("Server running on port 3000");
});
