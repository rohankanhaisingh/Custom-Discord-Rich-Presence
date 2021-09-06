const fs = require("fs"),
    path = require("path"),
    url = require("url");

const applicationName = "custom-discord-rpc";

function createAppDataFolderTemplate() {

    fs.mkdirSync(path.join(process.env.APPDATA, applicationName, "Backgrounds"))
    fs.mkdirSync(path.join(process.env.APPDATA, applicationName, "Application Data"))
    fs.mkdirSync(path.join(process.env.APPDATA, applicationName, "Cache"));

    createUserDataFileTemplate();
}

function createUserDataFileTemplate() {

    const config = {
        "clientID": null,
        "presence": {
            "details": "Details here!",
            "state": "State here!",
            "startTimestamp": Date.now(),
            "endTimestamp": Date.now(),
            "largeImageKey": "image key here",
            "smallImageKey": "image key here",
            "largeImageText": "Large image text!",
            "smallImageText": "Small image text!"
        }
    }

    fs.writeFileSync(path.join(process.env.APPDATA, applicationName, "Application Data", "configuration.json"), JSON.stringify(config, null, 2), { encoding: "utf-8" });

    return config;
}

function getConfigFile() {

    const appfolder = fs.readdirSync(path.join(process.env.APPDATA, applicationName), {encoding: "utf-8"});

    if (appfolder.includes("Application Data")) {

        const configFile = fs.readFileSync(path.join(process.env.APPDATA, applicationName, "Application Data", "configuration.json"), { encoding: "utf-8" });

        return JSON.parse(configFile);
    }

    createAppDataFolderTemplate();
}

function init() {

    const roamingDir = fs.readdirSync(process.env.APPDATA, { encoding: "utf-8" });

    if (!roamingDir.includes(applicationName)) {

        fs.mkdirSync(path.join(process.env.APPDATA, applicationName));

        createAppDataFolderTemplate();

        return;
    }

    return getConfigFile();
}

module.exports = {
    init: init
}