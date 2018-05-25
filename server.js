var socketIO = require('socket.io');
var server = require('http').createServer().listen(7000);
console.log(server.handshake) ;

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
console.log( "Listening on " + server_ip_address + ", port " + server_port )
var io = socketIO.listen(server);

// Super simple server:
//  * One room only.
//  * We expect two people max.
//  * No error handling.

io.sockets.on('connection', function (client) {
    console.log('new connection: ' + client.id);

    client.on('offer', function (details) {
        client.broadcast.emit('offer', details);
        console.log('offer: ' + JSON.stringify(details));
    });

    client.on('answer', function (details) {
        client.broadcast.emit('answer', details);
        console.log('answer: ' + JSON.stringify(details));
    });

    client.on('candidate', function (details) {
        client.broadcast.emit('candidate', details);
        console.log('candidate: ' + JSON.stringify(details));
    });

    // Here starts evertyhing!
    // The first connection doesn't send anything (no other clients)
    // Second connection emits the message to start the SDP negotation
    client.broadcast.emit('createoffer', {});
});
