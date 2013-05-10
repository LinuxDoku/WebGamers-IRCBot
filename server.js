var irc = require('irc');
var http = require('http');
var url = require('url');

// stat object 
var stats = {};

// setup channels
var config = {
	channels: ['#WebGamers']
};

var client = new irc.Client('irc.gamesurge.net', 'LinuxDokuBot', config);
client.addListener('error', function(message) {
	console.log('error: ', message);
});

client.addListener('names', function(channel, nicks) {
	stats[channel] = nicks;
});

setInterval(function() {
	var i;
	for(i = 0; i < config.channels.length; i++)
		client.send('names', config.channels[i]);
}, 5000);

// serve via http
http.createServer(function(req, res) {
	var path = url.parse(req.url).pathname.split('/');
	var channel = '#' + path[1];

	if(channel != null) {
		if(stats[channel] == null) {
			res.writeHead(404, {'Content-Type': 'text/plain'});
			res.end('404 not found');
		} else {
			res.writeHead(200, {'Content-Type': 'text/plain'});
			if(path[2] == null) {
				res.end(JSON.stringify(stats[channel]));
			} else if(path[2] == 'count') {
				res.end(Object.keys(stats[channel]).length.toString());
			} else {
				res.end('fail');
			}
		}
	} else {
		res.writeHead(404, {'Content-Type': 'text/plain'});
		res.end('404 not found');
	}
}).listen(1337, '0.0.0.0');
