const app = require('express')();
const http = require('http').Server(app);
const port = '8000';
const express = require('express');
const fs = require('fs');
var ttlCount;
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});
app.get('/join', (req, res) => {
	res.sendFile(__dirname + '/static/join.html');
});
app.post('/', (req, res) => {

	var id = req.body.id;
	var name = req.body.name;
	var usrID = req.body.usrID;
	fs.appendFile(`./static/chats/${id}.txt`, "", (err) => {
		if (err) throw err;
	});
	res.status(200);
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify({
		x: id,
		y: name,
		z: usrID
	}));
});

app.get('/chat', (req, res) => {
	res.sendFile(__dirname + '/static/chat.html');
});

app.get('/help', (req, res) => {
	res.sendFile(__dirname + '/static/help.html');
});

app.get("/countlines", (req, res) => {
	var fname = req.query.file + '.txt';
	countlines(`./static/chats/${fname}`);
	res.status(200);
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify({
		count: ttlCount
	}));

});

app.get('/getline', (req, res) => {
	var fname = req.query.file + '.txt';
	var line = req.query.line;
	readline(`./static/chats/${fname}`, line, (err, msg) => {
		res.status(200);
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify({
			msg: msg
		}));
	});
});

app.post('/chat', (req, res) => {
	var file = req.body.a;
	var msg = req.body.b;
	fs.appendFile(`./static/chats/${file}.txt`, msg + "\n", (err) => {
		if (err) throw err;
	});
	res.status(200);
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify({
		x: file
	}));
});

app.get('/share', (req, res) => {
        res.sendFile(__dirname + '/static/share.html');
});

function countlines(file) {
	var i;
	var count = 0;
	require('fs').createReadStream(file)
		.on('data', function(chunk) {
			for (i = 0; i < chunk.length; ++i)
				if (chunk[i] == 10) count++;
		})
		.on('end', function() {
			ttlCount = (count);

		});
}

function readline(filename, line_no, callback) {
	var data = fs.readFileSync(filename, 'utf8');
	var lines = data.split("\n");

	if (+line_no > lines.length) {
		throw new Error('File end reached without finding line');
	}

	callback(null, lines[+line_no]);
}

http.listen(port, () => {
	console.log(`listening on http://localhost:${port}/`);
});
