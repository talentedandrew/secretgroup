(function () {

    angular
        .module('mySecret12')
        .controller('roomCtrl', roomCtrl);

    roomCtrl.$inject = ['$state', '$scope', 'authentication', 'roomService', 'socket', '$stateParams', 'ngToast'];
    function roomCtrl($state, $scope, authentication, roomService, socket, $stateParams, ngToast) {
        var vm = this;
        vm.roomId = $stateParams.roomId;
        vm.userId = authentication.getId();
        vm.chat = [];
        vm.message = {
            'roomId': vm.roomId,
            'createdBy': vm.userId,
            'name': authentication.getName()
        }
        vm.roomInfo = {};
        vm.config = {};
        vm.getRoomInfo = function () {
            roomService.getRoomByAdmin(vm.roomId)
                .then(function (data) {
                    console.log(data.data);
                    if (data.data.room) {
                        vm.roomInfo = data.data.room[0];
                    }
                    ngToast.create({
                        className: 'success',
                        content: data.data.message
                    });
                })
                .catch(function (error) {
                    ngToast.create({
                        className: 'warning',
                        content: error.data.message
                    });
                });
        }
        vm.getRoomInfo();
        socket.on('connect', function () {
            console.log('connection established');
            socket.emit('setroom', vm.roomId);
        });
        socket.on('receivelastchatmessages', function (messages) {
            console.log(messages);
            vm.chat = messages.slice();;
            console.log(vm.chat);
            // socket.emit('setroom', vm.roomId);
        });
        socket.on('receivechatmessage', function (message) {
            console.log(message);
            vm.chat.push(message);
            // socket.emit('setroom', vm.roomId);
        });
        socket.on('chatmessagesavedtodb', function (status) {
            console.log(status);
            // socket.emit('setroom', vm.roomId);
        });

        vm.credentials = {};

        vm.onSubmitMessage = function () {
            console.log(vm.message);
            socket.emit('sendchatmessage', vm.message);
            vm.message.message = '';
        };

        $scope.$on("$stateChangeStart", function () {
            console.log('route change started')
            socket.emit('leaveroom', vm.roomId);
            socket.disconnect()
        });

        vm.putCustomScrollbar = function (direction, autoResize, show) {
            vm.config.direction = direction;
            vm.config.autoResize = autoResize;
            vm.config.scrollbar = {
                show: !!show
            };
            return vm.config;
        }
    }

})();