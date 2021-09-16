const rpc = require("discord-rpc"),
    fs = require('fs'),
    path = require("path"),
    url = require("url"),
    notifier = require('node-notifier');

const { dialog } = require("electron");

/**@type { rpc.Client } */
let discordClient;

function login(data, callback) {

    const clientID = data.clientID;

    if (typeof clientID !== 'string') {

        return;
    }

    discordClient = new rpc.Client({ transport: "ipc" });

    discordClient.on("ready", function () {

        // Notify when user has logged in succesfully
        notifier.notify({
            appID: "Custom Discord RPC",
            type: "info",
            title: 'Discord',
            message: `logged in as ${discordClient.user.username}#${discordClient.user.discriminator}`,
            icon: path.join(__dirname, "../", "view", "data", "images", "discord.png"),
            sound: true
        });

        callback(discordClient);
    });

    discordClient.login({ clientId: clientID }).catch(function (err) {

        discordClient.destroy();

        dialog.showMessageBox({
            type: "error",
            title: "Client Connection Error",
            message: err.message,
            detail: "User may lost connection or has entered a wrong client ID."
        });
    });

}

function getDiscordClient() {

    if (typeof discordClient !== "undefined") {

        return discordClient.user;

    } else {
        return null;
    }

}

/**
 * Sets presence on startup
 * @param {object} data
 */
function updatePresence(data, callback) {

    if (typeof discordClient == "undefined") {

        notifier.notify({
            appID: "Custom Discord RPC",
            type: "error",
            title: 'Discord',
            message: `Cannot set presence because Discord client has not been initialized.`,
            icon: path.join(__dirname, "../", "view", "data", "images", "discord.png"),
            sound: true
        });

        return;
    }

    try {

        const d = data.presence;

        discordClient.setActivity({
            details: typeof d.details == "string" ? d.details : "Details",
            state: typeof d.state == "string" ? d.state : "State",
            startTimestamp: d.startTimestamp !== false ? d.startTimestamp : undefined,
            endTimestamp: d.endTimestamp !== false ? d.endTimestamp : undefined,
            largeImageKey: typeof d.largeImageKey == "string" ? d.largeImageKey : undefined,
            smallImageKey: typeof d.smallImageKey == "string" ? d.smallImageKey : undefined,
            largeImageText: typeof d.largeImageText == "string" ? d.largeImageText : undefined,
            smallImageText: typeof d.smallImageText == "string" ? d.smallImageText : undefined,
            buttons: (typeof d.buttons == "object" && d.buttons.length > 0) ? d.buttons : undefined
        }).catch(function (err) {

            notifier.notify({
                appID: "Custom Discord RPC",
                type: "error",
                title: 'Discord',
                message: err.message,
                icon: path.join(__dirname, "../", "view", "data", "images", "discord.png"),
                sound: true
            });

            if (typeof callback == "function") callback(err);

        });
    } catch (err) {

        notifier.notify({
            appID: "Custom Discord RPC",
            type: "error",
            title: 'Discord',
            message: err.message,
            icon: path.join(__dirname, "../", "view", "data", "images", "discord.png"),
            sound: true
        });

    }

}

module.exports = {
    login: login,
    setPresenceOnStartup: updatePresence,
    updatePresence: updatePresence,
    getDiscordClient: getDiscordClient
}