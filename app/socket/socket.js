var Chat = require('../models/users.js').chat;
module.exports = function (io) {
    var roomId;
    io.on('connection', function (socket) {
        console.log('a user connected');
        socket.on('setroom', function (room) {
            socket.join(room);
            roomId = room;
            Chat.find({ 'roomId': roomId }).populate('createdBy', '_id firstname lastname').sort({ 'createdAt': 1 }).limit(10).exec(function (err, chats) {
                if (err) {
                   socket.emit('receivelastchatmessages', chats);

                }
                socket.emit('receivelastchatmessages', chats);
            });
        });

        /// on sending message
        socket.on('sendchatmessage', function (message) {

            //broadcast to everyone on receiving message
            message.createdAt = new Date();
            io.sockets.in(roomId).emit('receivechatmessage', message);
            // save chat to db
            var chat = new Chat({
                roomId: message.roomId,
                message: message.message,
                createdBy: message.createdBy
            });
            chat.save(function (error) {
                if (!error) {
                    Chat.findOne({ 'createdBy': message.createdBy, 'roomId': message.roomId })
                        .populate('createdBy', '_id firstname lastname')
                        .sort({ 'createdAt': 1 })
                        .exec(function (error, newchat) {
                            if (error) {
                                io.sockets.in(roomId).emit('chatmessagesavedtodb', { success: false });
                            }
                            else {
                                io.sockets.in(roomId).emit('chatmessagesavedtodb', { success: true });

                            }
                        });
                }
            });

        });
        socket.on('leaveroom', function () {
            socket.leave(socket.room)
            console.log('user left the room');
        });
        socket.on('disconnect', function () {
            console.log('user disconnected');
        });
    });
}