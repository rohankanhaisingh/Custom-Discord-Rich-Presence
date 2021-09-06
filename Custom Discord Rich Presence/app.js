// Import modules.
const path = require("path"),
    url = require("url"),
    fs = require("fs"),
    electron = require("electron"),
    express = require("express"),
    colors = require("colors"),
    io = require("socket.io")(5858);

const ioHandler = require("./backend/handleIO"),
    appData = require("./backend/appdata");

const parsedAppData = appData.init();

console.log(parsedAppData);

// Get required objects from 'electron' object.
const { app, BrowserWindow } = electron;

// Create empty variable.
let mainWindow;

// Event when electron has been loaded.
app.on("ready", function () {
    
    // Create new browser window.
    mainWindow = new BrowserWindow({
        title: "Custom Discord RPC",
        backgroundColor: "#1d1d1d",
        width: 700,
        height: 650,
        minHeight: 650,
        minWidth: 700,
        frame: false,
        titleBarStyle: "hidden",
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            nodeIntegrationInSubFrames: true,
            nodeIntegrationInWorker: true,
        }
    });

    if (parsedAppData.clientID == null) {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, "view", "login.html"),
            slashes: true,
            protocol: "file:"
        }));
    } else {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, "view", "index.html"),
            slashes: true,
            protocol: "file:"
        }));
    }


    io.sockets.on("connection", function (socket) {

        ioHandler.handle(socket);

    });
});