var booking = require('../Model/appointment');
var sockets = {};
var connectedUsers = {};
// var online = [];

sockets.init = function (server) {
    // socket.io setup
    var io = require('socket.io').listen(server);

    io.sockets.on('connection', function (socket) {
        //add user to socket
        socket.on('auth', function (user) {
            console.log('ddddd', user)
            // io.emit('noOfConnections', Object.keys(io.sockets.connected).length);
            connectedUsers[socket.id] = user;
            socket.join(user);
            // online.push(user);
            // io.sockets.emit('online', Object.values(connectedUsers));
        })

        // socket.on('online', function () {
        //     io.sockets.emit('online', Object.values(connectedUsers));
        // })

        socket.on('disconnect', function (err) {
            var e = connectedUsers[socket.id];
            if (e) {
                socket.leave(e);
                delete e;
            }
            console.log("user just got disconnected", e);
        });

        socket.on('logout', function (user) {
            //remove user
        })

        socket.on('notification', function (participants) {
            io.sockets.in('roomId').emit('notification', 'something');
        });

        socket.on('stylerLocation', function (location, credentials) {
            booking.findByIdAndUpdate(credentials.Id, { stylerLocation: location }).then(result => {
                io.sockets.in(credentials.userKey).emit('driverLocation', location);
            })
        })

        socket.on('appointmentBooked', function (userKey) {
            io.sockets.in(userKey).emit('appointmentBooked.send');
        })

        socket.on('accept.appointment', function (userKey) {
            io.sockets.in(userKey).emit('appointment.accepted');
        })

        socket.on('start.appointment', function (userKey) {
            io.sockets.in(userKey).emit('appointment.started');
        })

        socket.on('serviceCompleted', function (userKey) {
            io.sockets.in(userKey).emit('reviews.send');
        })
    });

}

module.exports = sockets;