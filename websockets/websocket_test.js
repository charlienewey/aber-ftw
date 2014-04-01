/* jslint browser: true */

var ready = false;
var connection;

function doSomething() {
	connection = new WebSocket('ws://ws.assemblyco.de');
	connection.onopen = function () {
			console.log('Open connection');
			ready = true;
		};

	// Log errors
	connection.onerror = function (error) {
				console.log('WebSocket Error');
			};

	// Log messages from the server
	connection.onmessage = function (e) {
			var newTime = new Date().getTime();

			console.log('Server: ' + e.data);
			document.getElementById('echoText').innerHTML += e.data + '<br />';
		};
}

function sendData() {
	if (ready) {
		msg = document.getElementById('msgBox').value;	
		connection.send(msg);
	}
}
