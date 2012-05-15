15/May 
var net = require('net');
var util = require('util');

var Client = function (socket) {
    this.socket = socket;
    this.nikname = null;
};

var server = net.createServer(function (socket) {
    util.log('Got a new connection.');
    var c = new Client(socket);
    allClients.push(c);

    // Attaching listeners to socket.
    socket.on('data', function (data) {
        util.log('Data received: ' + data);
        // Handle data.
    });

    socket.on('close', function (hadError) {
        util.log('Connection closed with error: ' + hadError);
        // Handle disonnection.
    });

    socket.on('error', function (e) {
        util.log('Error: ' + e);

        // Explicitly close the socket.
        socket.end();
    });
});
server.listen(5000);
