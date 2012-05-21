var net = require('net');
var util = require('util');

var allClients = new Array ();

Array.prototype.remove = function(e) {
  for (var i = 0; i < this.length; i++) {
      if (e == this[i]) { return this.splice(i, 1); }
        }
        };

var CreateClient = function (socket) {
    this.socket = socket;
    this.name = null;
};

//list of names in use for faster search indexed by name with value=1 if in use else undefined or 0;
var names= new Array();

var server = net.createServer(function (socket){

    socket.setTimeout(0);
    socket.setEncoding("utf8");
    util.log('Got a new connection.');
    var c = new CreateClient(socket);



    //Attaching listeners to socket. 
/*
    socket.on('close', function (hadError) {
        // Handling disonnection.
        util.log(allClients[c].name +' Connection closed with error: ' + hadError);
        names.remove(c.name);
        allClients.remove(c);
        });
*/
    socket.addListener("connect", function () {
            socket.write("Please type in username:\n");
            });

    socket.addListener("data", function (data) {
            console.log(data)
            // Getting User Name .
            if(c.name==null)
            {
             if(data in names){
                 socket.write('Name Already in use , Choose another name');}
             else{
                 names.push(data);
                 c.name=data;
                 allClients.push(c);
                 }
            }
            else
            {
            allClients.forEach(function(cl) {
                    if (cl != c) {
                    cl.socket.write(c.name + ": " + data);
                    };
                    });
            }
    });


    socket.addListener("end", function() {
            allClients.remove(c);
            allClients.forEach(function(cl) {
                cl.socket.write(c.name + " has left.\n");
                });
            names.remove(c.name) ;   
            socket.end();
            });
/*
    socket.on('error', function (e) {
              socket.end();
    });
*/
});

// listening to requests at port 5000
server.listen(5000,function(){
    util.log('server bound');
});
