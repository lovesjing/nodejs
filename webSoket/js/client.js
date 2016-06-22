(function () {
	var d= document,
	w= window,
	p=parseInt,
	dd= d.documentElement,
	db = d.body,
	dc = d.compatMode == 'css1Compat',
	dx = dc ? dd: db;
	ec = encodeURIComponent;

	w.CHAT = {
		msgObj:d.getElementById("message"),
		screenHeight: w.innerHeight ? w.innerHeight : dx.clientHeight,
		username:null,
		userid:null,
		socket:null,
		scrollToBottom: function() {
			w.scrollTo(0, this.msgObj.clientHeight);
		},
		logout: function() {
			location.reload();
		},
		submit: function() {
			var content = d.getElementById("content").value;
			if(content != '') {
				var obj = {
					userid: this.userid,
					username: this.username,
					content: content
				};
				this.socket.emit('message', obj);
				d.getElementById("content").value = "";
			}
			return false;
		},
		genUid: function() {
			return new Date().getTime() + " " + Math.floor(Math.random()*899 + 100);
		},
		//更新系统消息
		updateSysMsg: function(o, action) {
			var onlineUsers = o.onlineUsers;
			var onlineCount = o.onlineCount;
			console.log(onlineCount);
			var user = o.user;

			//更新在线人数
			var userHtml = "";
			var separator = "";
			for(key in onlineUsers) {
				if(onlineUsers.hasOwnProperty(key)) {
					userHtml += separator + onlineUsers[key];
					separator = '、';
				}
			}
			d.getElementById("onlinecount").innerHTML = '当前共有' +onlineCount+ '人在，在线列表:'+ userHtml;
			//添加系统消息
			var html = '';
			html += '';
			html += user.username;
			html += (action == 'login') ? '加入了聊天室':'退出了聊天室';
			html +='';
			var section = d.createElement('section');
			section.className = '';
			section.innerHTML = html;
			this.msgObj.appendChild(section);
			this.scrollToBottom();
	},
	usernameSubmit: function() {
		var username = d.getElementById("username").value;
		if(username != "") {
			d.getElementById("username").value = "";
			d.getElementById("loginbox").style.display = 'none';
			d.getElementById("chatbox").style.display = 'block';			
			this.init(username);
		}
		return false;
	},
	init: function(username) {
		//客户端根据时间和随机数生成id
		this.userid = this.genUid();
		this.username = username;
		d.getElementById("showusername").innerHTML = this.username;
		this.msgObj.style.minHeight = (this.screenHeight - db.clientHeight + this.msgObj.clientHeight) + "px";
		this.scrollToBottom();
		//链接webscoke后端服务
		this.socket = io.connect('ws://localhost:3000');

		//告诉服务器有用户登录
		this.socket.emit('login', {userid:this.userid, username: this.username});

		//监听有新用户登录
		this.socket.on('login', function(o){
			CHAT.updateSysMsg(o, 'login');
		});

		//监听用户退出
		this.socket.on('logout', function(o) {
			CHAT.updateSysMsg(o, 'logout');
		});

		//监听消息发送
		this.socket.on('message', function(obj) {		
			var isme = (obj.userid == CHAT.userid) ? true : false;
			var contentDiv = '' + obj.content + '';
			var usernameDiv = '' + obj.username + '';
			var section = d.createElement('section');
			if(isme) {
				section.className = 'user';
				section.innerHTML = contentDiv + usernameDiv;
			}else {
				section.className = 'service';
				section.innerHTML = contentDiv + usernameDiv;
			}
			CHAT.msgObj.appendChild(section);
			CHAT.scrollToBottom();
		});
	}
};
	d.getElementById("username").onkeydown = function(e) {
		e = e || event;
		if(e.keyCode === 13) {
			CHAT.usernameSubmit();
		}
	};
	d.getElementById("content").onkeydown = function(e) {
		e = e || event;
		if(e.keyCode === 13) {
			CHAT.submit();
		}
	}

})(window.onload || {});