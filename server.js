const express = require('express');
const app= express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set("port", process.env.PORT || 2000);
app.use(express.static(__dirname + "/public"));
var users=0;
io.sockets.on('connection', (socket)=>{
  console.log('a new user connected');
  users++;
  io.emit('NrOfUsrs',users);

  socket.on('nickname', (data)=>{
    socket.nickname = data;
  });
  socket.on('chat message', (message)=> {
    const newMsg = {nick: socket.nickname, msg: message};
    io.emit('chat message',newMsg);
  });
  socket.on('disconnect',()=>{
    console.log(socket.nickname + ' disconnected');
    users--;
    io.emit('disconnection', socket.nickname);
    io.emit('NrOfUsrs',users);
  });

});

app.get('/', (req,res)=>{
  res.sendFile(__dirname +'/home.html');
});


http.listen(app.get("port"), () => {
  console.log("Server started on http://localhost: " + app.get("port"));
});
