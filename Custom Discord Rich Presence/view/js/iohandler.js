const io = require("socket.io-client");

const socket = io("http://localhost:5858");

export function emitData(channel, data) {
    if (typeof channel !== "undefined") {

        if (typeof data !== "undefined") {

            socket.emit(channel, data);

            return "emitted";
        }

        socket.emit(channel, {
            emitTimestamp: Date.now()
        });

    }
}