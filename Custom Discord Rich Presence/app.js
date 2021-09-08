// Import modules.
const path = require("path"),
    url = require("url"),
    fs = require("fs"),
    electron = require("electron"),
    express = require("express"),
    colors = require("colors"),
    io = require("socket.io")(5858);

const { login, setPresenceOnStartup } = require("./backend/discord");
const ioHandler = require("./backend/handleIO"),
    appData = require("./backend/appdata");

const parsedAppData = appData.init();

// Get required objects from 'electron' object.
const { app, BrowserWindow, ipcMain } = electron;

/**@type { BrowserWindow } */
let mainWindow, loader;

// Event when electron has been loaded.
app.on("ready", function () {

    loader = new BrowserWindow({
        width: 300,
        height: 460,
        minWidth: 300,
        minHeight: 460,
        maxWidth: 300,
        maxHeight: 460,
        frame: false,
        show: false,
        icon: "./assets/icons/win/icon_small.png",
        autoHideMenuBar: true,
        titleBarStyle: "hidden"
    });

    loader.setMenu(null);

    loader.webContents.once("dom-ready", function () {

        setTimeout(function () {
            // Create new browser window.
            mainWindow = new BrowserWindow({
                title: "Custom Discord RPC",
                backgroundColor: "#0e0e0e",
                width: 700,
                height: 650,
                minHeight: 650,
                minWidth: 700,
                frame: false,
                show: false,
                titleBarStyle: "hidden",
                webPreferences: {
                    contextIsolation: false,
                    nodeIntegration: true,
                    nodeIntegrationInSubFrames: true,
                    nodeIntegrationInWorker: true,
                }
            });

            mainWindow.webContents.once("dom-ready", function () {

                console.log("Main window succesfully has been loaded".green);

                mainWindow.show();

                loader.hide();
                loader.close();

            });

            if (parsedAppData.clientID == null) {
                mainWindow.loadURL(url.format({
                    pathname: path.join(__dirname, "view", "login.html"),
                    slashes: true,
                    protocol: "file:"
                }));
            } else {

                login({ clientID: parsedAppData.clientID }, function (client) {

                    mainWindow.loadURL(url.format({
                        pathname: path.join(__dirname, "view", "index.html"),
                        slashes: true,
                        protocol: "file:"
                    }));

                    setPresenceOnStartup(parsedAppData);

                });
            }

            ipcMain.on("app:close", function (event, args) {

                mainWindow.close();
                app.exit();
                process.exit();

            });

            ipcMain.on("app:toggle_windowsize", function (event, args) {

                if (mainWindow.isMaximized()) {
                    mainWindow.unmaximize();
                } else {
                    mainWindow.maximize();
                }

            });


            ipcMain.on("app:minimize", function (event, args) {

                mainWindow.minimize();

            });

            // SocketIO handlers
            io.sockets.on("connection", function (socket) {

                ioHandler.init(socket);

                ioHandler.handle(socket, mainWindow);

            });
        }, 2000);

    });

    loader.loadURL(url.format({
        pathname: path.join(__dirname, "view", "loader.html"),
        slashes: true,
        protocol: "file:"
    }));

    loader.show();
});