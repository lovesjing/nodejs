var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.get('/', function (req, res) {
	res.end('<h1>hello welcome realtime Service</h1>')
});

http.listen(3000, function() {
	console.log("listen on port 3000");
});

//在线的用户
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;
 io.on('connection', function(socket) {
 	console.log('a user connected');

 	//监听新用户加人
 	socket.on('login', function(obj) {
 		//将新加人用户的唯一标示当做socket的名称，后面退出会用到
 		socket.name = obj.userid;	
 		//检查在线列表，如果不在线就加人
 		if(!onlineUsers.hasOwnProperty(obj.userid)) {
 			onlineUsers[obj.userid] = obj.username;
 			//在线人数加1
 			onlineCount++;
 		}
 		//向所有客户端广播用户加人
 		io.emit('login',{onlineUsers:onlineUsers,onlineCount:onlineCount,user:obj});
 		console.log(obj.username + '加入了聊天室');
 	});
 	//监听用户退出
 	socket.on('disconnect', function() {
 		//将退出的用户从列表中删除
 		if(onlineUsers.hasOwnProperty(socket.name)) {
 			//退出用户信息
 			var obj = {userid: socket.name, username:onlineUsers[socket.name]};
 			//删除
 			delete onlineUsers[socket.name];

 			onlineCount--;
 			//向所有用户发出广播用户退出
 			io.emit('logout',{onlineUsers:onlineUsers, onlineCount: onlineCount,user: obj});
 			console.log(obj.name + '退出了聊天室');
 		}
 	});

 	//发送消息
 	socket.on('message', function(obj) {
 		//向所有客户端广播发布的消息
 		io.emit('message', obj);
 		console.log(obj.username + '说：' + obj.content);
 	});
 });
