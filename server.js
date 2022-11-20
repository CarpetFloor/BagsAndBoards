const { createSocket } = require('dgram');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const { start } = require('repl');
const port = 3000;

app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log(socket.id + " connected");

    socket.on("disconnect", () => {
        let id = socket.id;

        console.log(id + " disconnected");
    });
});

http.listen(process.env.PORT || port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
    console.log("");
});