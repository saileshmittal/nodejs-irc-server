var net = require('net');
// Have to ask  for name here 
var name = "Piyush Ahuja\n";
var client = net.connect(5000, function(){
        console.log('client connected');
        client.write(name);
        });
client.on('data', function(data) {
        console.log(data.toString());
//        client.end();
        });
client.on('end', function() {
        console.log('client disconnected');
        });
