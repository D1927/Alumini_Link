const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const questionRoutes = require("./ask_a_question");  // Ensure correct import

const app = express();
app.use(express.json());
app.use(cors());

// Create HTTP server and WebSocket instance
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// Attach `io` globally to all requests
app.use((req, res, next) => {
    req.io = io;  
    next();
});

// Use Q&A routes
app.use("/questions", questionRoutes);

// WebSocket event listener
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
