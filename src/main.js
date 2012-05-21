var net = require('net');
var util = require('util');

var allClients = new Array ();

var CreateClient = function (socket) {
  //  this.socket = socket;
    this.name = null;
    this.with= new Array ();
};

//list of names in use for faster search indexed by name with value=1 if in use else undefined or 0;

var names= new Array();

var server = net.createServer(function (socket){
    util.log('Got a new connection.');
    var c = new CreateClient(socket);
    //Indexing with Sockets as Keys .
    allClients[socket]=c;
    console.log(allClients[socket]);
    console.log(allClients);
    //Attaching listeners to socket.
    socket.on('data', function (data) {
        util.log('Data received: ' + data);
        //Handle data
        if(allClients[socket].name==null)
            {
            if(names[data]==1){
                socket.write('Name Already in use');}
            else{
                names[data]=1;
                }
            }

        });

    socket.on('close', function (hadError) {
        names[allClients[socket]]=0;
        allClients[socket]=undefined;
        util.log(allClients[socket].name +' Connection closed with error: ' + hadError);
        // Handle disonnection.
    });

    socket.on('error', function (e) {
        names[allClients[socket].name]=0;
        allClients[socket]=undefined;
        util.log('Error: ' + e);
        if (e.code == 'EADDRINUSE') {
        console.log('Address in use, retrying...');
        setTimeout(function () {
            server.close();
            server.listen(PORT, HOST);
            }, 1000);
    // Explicitly close the socket.
    //else {
    //          socket.end();
    //      }
    }
    });
});

// listening to requests at port 5000

server.listen(5000,function(){
    util.log('server bound');
})
