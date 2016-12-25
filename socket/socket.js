module.exports = function(io) {
    
    var users = {};
    
    io.on('connection', function (socket) {

        socket.on('username', function(data) {
            
            if(users[socket.id]) {
                socket.broadcast.emit('info', users[socket.id] + ' ismini ' + data + ' olarak değiştirdi.');
            } else {
                socket.broadcast.emit('info', data + ' bağlandı.');
            }
            users[socket.id] = data;
            io.emit('count', users);
            
        });

        socket.on('typing', function(data) {
            
            if(data === true)
                socket.broadcast.emit('typing', '{' + users[socket.id] + '} yazıyor..');
            else
                socket.broadcast.emit('typing', '');
        });
        
        socket.on('message', function (data) {
            
            
            socket.broadcast.emit('message', data + ' - {' + users[socket.id] + '}');
            
                
                var youtube = data.match(/youtube.com\/watch\?(?=.*v=([\w|-]+))(?:\S+)?$/);
                if(youtube) {
                    
                    io.emit('youtube', youtube[1]);
                }
        });        
        
        socket.on('disconnect', function() {
            socket.broadcast.emit('info', users[socket.id] + ' konuşmadan çıktı.');
            delete users[socket.id]; 
            io.emit('count', users);
        });
        
    });
}