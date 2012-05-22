var net = require('net');
var util = require('util');
var allClients = new Array ();
var fields;

Array.prototype.remove = function (e) {
    for (var i = 0; i < this.length; i++) {
        if (e == this[i]) { return this.splice(i, 1); }
    }
};

var Client = function (socket) {
    this.socket = socket;
    this.name = null;
};

//list of names in use for faster search indexed by name with value=1 if in use else undefined or 0;
var names= new Array();

var server = net.createServer( function (socket){

        socket.setTimeout(0);//Disable Timeout. 
        socket.setEncoding('utf8');
        util.log('Got a new connection.');
        var connection = new Client(socket);

        //Attaching listeners to socket. 
        socket.addListener('close', function (hadError) {
            // Handling disonnection.
            util.log(connection.name +' Connection closed with error: ' + hadError);
            names.remove(connection.name);
            allClients.remove(connection);
        });

        socket.addListener('connect', function () {
            socket.write('Please type in username:\n');
        });

        socket.addListener('data', function (data) {
            // Getting User Name .
            if(connection.name==null){
                var flag1=0;
                fields = data.split(/NICKNAME:/);
                if(fields.length>1){
                    flag1=1;
                    fields=fields[1].split('\r')
                    data=fields[0];
                    var flag=0;
                    for(var i=0;i<names.length;i++){
                        if(data==names[i]){
                            flag=1;
                            break;}
                    };
                };
                if(flag1==0){;//do nothing
                }
                else if(data.length==0){
                    socket.write('Please Follow Protocol\r\n');}
                else if(fields.length>2){
                    socket.write('Please Follow Protocol\r\n');}
                else if(flag){
                    socket.write('Name Already in use , Choose another name\r\n');}
                else{
                    socket.write('You Are Now connected\n');
                    names.push(data);
                    connection.name=data;
                    allClients.push(connection);}
            }
            else{
                fields = data.split(/MESSAGE:/);
                for(var i=1;i<fields.length;i++){
                    allClients.forEach( function (allconnections) {
                        data=fields[i];
                        if (allconnections != connection) {
                            allconnections.socket.write(connection.name + " : " + data);
                        };
                    })
                };
            }
        });

        socket.addListener('end', function () {
            allClients.remove(connection);
            allClients.forEach(function (allconnections) {
                allconnections.socket.write(connection.name + ' has left.\n');
                });
            names.remove(connection.name) ;   
            socket.end();
        });


        socket.addListener('error', function (e) {
            socket.end();
        });
});

// listening to requests at port 5000
server.listen(5000, function (){
    util.log('server bound');
});
