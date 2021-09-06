function handle(socket) {

    socket.on("app:update_presence", function (data) {

        console.log(data);

    });

}

module.exports = {
    handle: handle
}