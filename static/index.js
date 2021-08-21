var id, name, usrID;

function spaces(str) {
	if (!str.replace(/\s/g, '').length) {
		return true;
	} else {
		return false;
	}
}

function generateId(x) {
	var pass = '';
	var str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	for (var i = 1; i <= x; i++) {
		var char = Math.floor(Math.random() * str.length + 1);
		pass += str.charAt(char);
	}
	return pass;
}

function create() {
	id = generateId(16);
	usrID = generateId(10);
	name = document.getElementById("username").value;
	if (spaces(name) != true) {
		send2Create(id, name, usrID);
	} else {
		erroroccour();
	}
}

function join() {
	id = document.getElementById("chatid").value;
	id = id.replace(/\s/g, '');
	name = document.getElementById("username").value;
	usrID = generateId(10);
	if (spaces(name) != true && spaces(id) != true) {
		send2Create(id, name, usrID);
	} else {
		erroroccour();
	}
}

function isvalid(a, b, c) {
	sessionStorage.setItem("chatid", a);
	sessionStorage.setItem("name", b);
	sessionStorage.setItem("usrID", c);
	window.location = 'chat';
}


function erroroccour() {

	alert("Please Enter a Valid Name");

}

function send2Create(a, b, c) {

	$.ajax({
		url: "/",
		type: "post",
		dataType: 'json',
		data: {
			id: a,
			name: b,
			usrID: c
		},
		success: function(result) {
			isvalid(result.x, result.y, result.z);
		},
		error: function() {
			erroroccour();
		}

	});

}
