const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const questionRoutes = require("./ask_a_question");  

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use((req, res, next) => {
    req.io = io;  
    next();
});

app.use("/questions", questionRoutes);

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
