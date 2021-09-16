const fs = require("fs"),
    path = require("path"),
    url = require("url");
const { getDiscordClient } = require("./discord");

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
        "appearance": {
            "theme": "bright"
        },
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

/**
 * Saves presence data into config file.
 * @param {object} data
 */
function saveData(data) {

    const currentData = getConfigFile();

    for (let key in data) {

        currentData.presence[key] = data[key];

        //if (currentData.presence[key] !== data[key]) {
        //    currentData.presence[key] = data[key];
        //}

    }

    fs.writeFileSync(path.join(process.env.APPDATA, applicationName, "Application Data", "configuration.json"), JSON.stringify(currentData, null, 2), { encoding: "utf-8" });

}

/**
 * Gets data from configuration file.
 */
function getConfigFile() {

    const appfolder = fs.readdirSync(path.join(process.env.APPDATA, applicationName), {encoding: "utf-8"});

    if (appfolder.includes("Application Data")) {

        const configFile = fs.readFileSync(path.join(process.env.APPDATA, applicationName, "Application Data", "configuration.json"), { encoding: "utf-8" });

        return JSON.parse(configFile);
    }

    createAppDataFolderTemplate();
}

/**
 * Sets client id in config file.
 * @param {string} clientID
 */
function setClientID(clientID) {

    const appfolder = fs.readdirSync(path.join(process.env.APPDATA, applicationName), { encoding: "utf-8" });

    if (!appfolder.includes("Application Data")) return;

    const configFile = fs.readFileSync(path.join(process.env.APPDATA, applicationName, "Application Data", "configuration.json"), { encoding: "utf-8" });

    const format = JSON.parse(configFile);

    format["clientID"] = clientID;

    fs.writeFileSync(path.join(process.env.APPDATA, applicationName, "Application Data", "configuration.json"), JSON.stringify(format, null, 2), { encoding: "utf-8" });

    return clientID;
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
    init: init,
    setClientID: setClientID,
    getConfigFile: getConfigFile,
    saveData: saveData,
    createUserDataFileTemplate: createUserDataFileTemplate
}