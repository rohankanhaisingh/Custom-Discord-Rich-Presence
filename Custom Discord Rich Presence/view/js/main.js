import "./essentials.js";
import "./navbar.js";

import { emitData, listen } from "./iohandler.js";
import { Toast } from "./toast.js";

const inputFields = document.querySelectorAll(".visualizer-inputfield"),
    emitButtons = document.querySelectorAll(".emit-event-button"),
    loader = document.querySelector(".app-loader");

function handleInputFields(inputfields) {

    const tempObject = {};

    inputfields.forEach(function (field) {

        let inputType = field.getAttribute("data-type"),
            inputValue = field.innerText,
            parsedValue = inputValue,
            fieldId = field.getAttribute("data-bind");

        switch (inputType) {

            case "number":

                if (parsedValue !== "") {

                    if (parsedValue == "now") {

                        parsedValue = Date.now();

                    } else {
                        parsedValue = parseFloat(inputValue);
                    }

                    if (isNaN(parsedValue)) {

                        field.innerHTML = Date.now();

                        parsedValue = Date.now();
                    }
                } else {
                    parsedValue = false;
                }

                break;
            case "string":

                if (parsedValue == '' || typeof parsedValue == "undefined") {
                    parsedValue = false;
                }

                break;
        }

        tempObject[fieldId] = parsedValue;

    });

    return tempObject;

}

function startListeners() {

    listen("discord.response:getClientData", function (data) {

        const profileNameNode = document.querySelector(".discord-visualizer-profile-name"),
            profilePictureNode = document.querySelector(".discord-visualizer-profile-picture img"),
            navbarProfilePictureNode = document.querySelector(".navbar-user-profile-picture img"),
            navbarProfileNameNode = document.querySelector(".navbar-user-profile-name span");


        profilePictureNode.src = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;
        navbarProfilePictureNode.src = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;

        profileNameNode.innerHTML = `<span>${data.username}#<b>${data.discriminator}</b></span>`;
        navbarProfileNameNode.innerText = `${data.username}`;

        loader.classList.add("fadeout");

        setTimeout(function () {

            loader.classList.add("hidden");

            loader.classList.remove("fadeout");

        }, 300);
    });

    listen("app.response:getPresenceData", function (data) {

        const presenceData = data.presence;

        for (let key in presenceData) {

            inputFields.forEach(function (field) {

                const fieldAttr = field.getAttribute("data-bind");

                if (fieldAttr == key) {
                    if (typeof presenceData[key] !== "boolean") {
                        field.innerHTML = presenceData[key];
                    }
                }

            });

        }

    });
}

function updatePresence() {
    emitData("app:update_presence", handleInputFields(inputFields));

    new Toast("Discord Presence", "Presence has been succesfully updated.", "icon:discord", 3000);
}

function keyboardHandlers() {

    inputFields.forEach(function (field) {
        
        field.addEventListener("keydown", function (event) {

            switch (event.keyCode) {
                case 13:

                    event.preventDefault();

                    break;
            }

        });

    });

}

function inputDateHandlers() {

    inputFields.forEach(function (field) {

        const interactionAttr = field.getAttribute("data-interactive");

        if (interactionAttr === null) return;

        switch (interactionAttr) {
            case "date":

                field.addEventListener("click", function () {

                    if (!field.classList.contains("active")) {

                        field.classList.add("active");

                        let tempEm = document.createElement("input");
                        tempEm.type = "datetime-local";

                        tempEm.addEventListener("change", function () {

                            const selectedDate = new Date(tempEm.value);

                            const format = selectedDate.getTime();

                            tempEm.remove();

                            field.classList.remove("active");

                            field.innerHTML = format;

                            tempEm = null;

                        });

                        field.appendChild(tempEm);

                        tempEm.focus();
                        tempEm.click();
                    } 


                });

                break;
        }

    });

}

window.addEventListener("load", function () {

    // Requesting data from the server.
    emitData("discord:getClientData");
    emitData("app:getPresenceData");

    startListeners();
    keyboardHandlers();
    inputDateHandlers();

    emitButtons.forEach(function (button) {

        const emitChannel = button.getAttribute("socket-emit");

        button.addEventListener("click", function () {
            if (emitChannel !== null) {

                switch (emitChannel) {
                    case "app:update_presence":

                        updatePresence();

                        break;
                    default:
                        emitData(emitChannel, 0);
                        break;
                }

            }
        });

    });


});