const express = require('express');
const app= express();
const pug = require('pug');
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.set("view options", {layout: false});
app.use(express.static(__dirname + "/public"));

io.sockets.on('connection', (socket)=>{
  console.log('a new user connected');
  socket.on('setPseudo', (data)=>{
    socket.set('pseudo', data);
  });
  socket.on('message', (message)=> {
    socket.get('pseudo', function (error, name) {
        const data = { 'message' : message, pseudo : name };
        socket.broadcast.emit('message', data);
        console.log("user " + name + " send this : " + message);
    });
});
});
app.get('/', (req,res)=>{
  res.render('home.pug');
});


app.listen(3000);
