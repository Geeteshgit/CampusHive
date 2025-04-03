require("dotenv").config();

const http = require("http");
const app = require("./app.js");
const { Server } = require("socket.io");
const socketHandler = require("./config/socket.js");
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
    cors : {
        origin : "*",
        methods : ['GET', 'POST'],
        credentials : true
    },
    pingInterval : 25000,
    pingTimeout : 5000,
});

socketHandler(io);

server.listen(PORT, () => {
    console.log(`Server Listening on Port : ${PORT}`);
});