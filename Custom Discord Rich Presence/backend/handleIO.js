const path = require("path"),
    url = require("url"),
    fs = require("fs"),
    electron = require("electron");
    colors = require("colors");

const { login, getDiscordClient, updatePresence } = require("./discord");

const appdata = require("./appdata");
const { getConfigFile, saveData } = require("./appdata");

const { Client } = require("socket.io-client");
const { BrowserWindow } = require("electron");

let activeSocket;

function init(socket) {

    activeSocket = socket;

    return socket;

}

function emitData(channel, data) {

    if (typeof channel !== "undefined") {

        if (typeof data !== "undefined") {

            activeSocket.emit(channel, data);

            return "emitted";
        }

        activeSocket.emit(channel, {
            emitTimestamp: Date.now()
        });

    }

}

/**
 * Handles input and output from client.
 * @param {Client} socket
 * @param {BrowserWindow} window
 */
function handle(socket, window, app) {

    socket.on("app:update_presence", function (data) {

        saveData(data);

        updatePresence({
            timestamp: Date.now(),
            type: "object",
            presence: data
        });

    });

    socket.on("discord:login", function (data) {

        login(data, function (client) {

            appdata.setClientID(data.clientID);

            activeSocket.emit("discord:logged_in", client.user);

            // emitData("discord:logged_in", client);
        });

    });

    socket.on("app:changeWindowURL", function (data) {

        window.loadURL(url.format({
            pathname: path.join(__dirname, "../", "view", "index.html"),
            slashes: true,
            protocol: "file:"
        }));

    });

    socket.on("discord:getClientData", function (args) {

        const discordClient = getDiscordClient();

        activeSocket.emit("discord.response:getClientData", discordClient);

    });

    socket.on("app:getPresenceData", function (args) {
        const data = getConfigFile();

        activeSocket.emit("app.response:getPresenceData", data);
    });
}


module.exports = {
    handle: handle,
    init: init,
    emitData: emitData
}