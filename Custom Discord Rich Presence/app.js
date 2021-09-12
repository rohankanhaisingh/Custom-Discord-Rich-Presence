// Import modules.
const path = require("path"),
    url = require("url"),
    fs = require("fs"),
    electron = require("electron"),
    express = require("express"),
    colors = require("colors"),
    socketio = require("socket.io");

// Auto updater
require('update-electron-app')({
    repo: 'babahgee/Custom-Discord-Rich-Presence',
    updateInterval: '1 hour',
    logger: require('electron-log'),
    notifyUser: true
})

// Get required objects from 'electron' object.
const { app, BrowserWindow, ipcMain, dialog } = electron;

// Start Socket.IO server before executing other code
const io = socketio(5858);

io.on("error", function () {
    dialog.showMessageBox({
        type: "error",
        title: "Local Connection Error",
        message: err.message,
        detail: "Cannot use port 5858, another application may use that port already. Enter 'netstat' in command prompt (Windows) to see which application is using this port."
    });
});

const ioHandler = require("./backend/handleIO"),
    appData = require("./backend/appdata");
const { login, setPresenceOnStartup } = require("./backend/discord");
const appdata = require("./backend/appdata");

const parsedAppData = appData.init();

const loadMainApp = true;

/**@type { BrowserWindow } */
let mainWindow, loader;

// Event when electron has been loaded.
app.on("ready", function () {

    loader = new BrowserWindow({
        width: 700,
        height: 650,
        minHeight: 650,
        minWidth: 700,
        maxWidth: 650,
        maxHeight: 700,
        frame: true,
        show: false,
        icon: "./assets/icons/win/discord.png",
        transparent: true,
        autoHideMenuBar: true,
        resizable: false,
        titleBarStyle: "hidden",
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            nodeIntegrationInSubFrames: true,
            nodeIntegrationInWorker: true,
        }
    });

    loader.webContents.on("dom-ready", function () {

        ipcMain.on("loader:getstatus", function (event, args) {

            setTimeout(function () {
                event.reply("loader:animate", null);
            }, 1000);
        });

        loader.show();

        if (!loadMainApp) return;

        if (typeof parsedAppData == "undefined") {
            app.relaunch();
            app.exit(0);

            return;
        }

        setTimeout(function () {
            // Create new browser window.
            mainWindow = new BrowserWindow({
                title: "Custom Discord RPC",
                backgroundColor: "#0e0e0e",
                width: 700,
                height: 650,
                minHeight: 650,
                minWidth: 700,
                resizable: true,
                frame: false,
                show: false,
                titleBarStyle: "hidden",
                icon: "./assets/icons/win/discord.png",
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

            ipcMain.on("app:logout", function (event, args) {

                const data = appdata.getConfigFile();

                if (data.clientID == null) {

                    return;
                }

                appdata.setClientID(null);

                app.relaunch();
                app.exit(0);

                return;

            });

            ipcMain.on("app:devtools", function (event, args) {

                mainWindow.webContents.openDevTools();

            });

            ipcMain.on("app:reload", function (event, args) {

                app.relaunch();
                app.exit(0);

                return;
            });

            ipcMain.on("app:minimize", function (event, args) {

                mainWindow.minimize();

            });

            // SocketIO handlers
            io.sockets.on("connection", function (socket) {

                ioHandler.init(socket);

                ioHandler.handle(socket, mainWindow, app);

            });
        }, 1000);

    });


    loader.loadURL(url.format({
        pathname: path.join(__dirname, "view", "loader.html"),
        slashes: true,
        protocol: "file:"
    }));
});