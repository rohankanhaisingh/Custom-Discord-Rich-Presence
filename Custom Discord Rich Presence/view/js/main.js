import "./essentials.js";
import "./navbar.js";

import { emitData, listen } from "./iohandler.js";
import { Toast } from "./toast.js";
import { addClassOnInterval } from "./essentials.js";

const inputFields = document.querySelectorAll(".visualizer-inputfield"),
    inputToggles = document.querySelectorAll(".discord-vizualizer-button-toggle"),
    emitButtons = document.querySelectorAll(".emit-event-button"),
    loader = document.querySelector(".app-loader"),
    allInputFields = document.querySelectorAll("[contenteditable]");

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

        // Remove input elements if field has.
        const inputs = field.querySelectorAll("input");

        inputs.forEach(function (input) {

            input.remove();

        });

        // Remove classlist if it has.
        if (field.classList.contains("active")) {
            field.classList.remove("active");
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
            navbarProfileNameNode = document.querySelector(".navbar-user-profile-name span"),
            animatedElements = document.querySelectorAll(".animate-when-document-loaded");


        profilePictureNode.src = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;
        navbarProfilePictureNode.src = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;

        profileNameNode.innerHTML = `<span>${data.username}<b>#${data.discriminator}</b></span>`;
        navbarProfileNameNode.innerText = `${data.username}`;


        loader.classList.add("fadeout");
        for (let i = 0; i < animatedElements.length; i++) addClassOnInterval(animatedElements[i], "visible", i, 50);

        setTimeout(function () {

            loader.classList.add("hidden");

            loader.classList.remove("fadeout");

        }, 300);
    });

    listen("app.response:getPresenceData", function (data) {

        const presenceData = data.presence;

        console.log(presenceData);

        const buttons = presenceData.buttons;

        if (buttons.length > 0) {

            const wrappers = document.querySelectorAll(".discord-vizualizer-button-wrapper");

            for (let i = 0; i < buttons.length; i++) {

                const button = buttons[i],
                    selectedWrapper = wrappers[i];

                const toggle = selectedWrapper.querySelector(".discord-vizualizer-button-toggle"),
                    label = selectedWrapper.querySelector(".discord-vizualizer-button-inputfield[data-bind='label']"),
                    url = selectedWrapper.querySelector(".discord-vizualizer-button-inputfield[data-bind='url']");

                toggle.classList.add("active");

                label.innerText = button["label"];
                url.innerText = button["url"];
            }
        }

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

/**
 * Handles input buttons
 * @param {HTMLDivElement} wrapper
 */
function handleInputButtons(wrapper) {

    const isActiveButton = wrapper.querySelector(".discord-vizualizer-button-toggle");

    if (!isActiveButton.classList.contains("active")) return;

    const label = wrapper.querySelector(".discord-vizualizer-button-inputfield[data-bind='label']");
    const url = wrapper.querySelector(".discord-vizualizer-button-inputfield[data-bind='url']");

    if (url.innerText !== "" && label.innerText !== "") {
        return {
            "label": label.innerText,
            "url": url.innerText
        }
    } else {

        if (label.innerText == "") {

            label.classList.add("error");

            setTimeout(function () {
                label.classList.remove("error");
            }, 1000);

        }

        if (url.innerText == "") {

            url.classList.add("error");

            setTimeout(function () {
                url.classList.remove("error");
            }, 1000);

        }

    }

}

function updatePresence() {

    const wrappers = document.querySelectorAll(".discord-vizualizer-button-wrapper");

    const data = {
        buttons: []
    };

    const inputValues = handleInputFields(inputFields);

    for (let key in inputValues) {
        data[key] = inputValues[key];
    }

    wrappers.forEach(function (wrapper) {

        const d = handleInputButtons(wrapper);

        if (typeof d !== "undefined") data.buttons.push(d);
    });

    emitData("app:update_presence", data);

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

    allInputFields.forEach(function (input) {

        input.addEventListener("paste", function (e) {
            event.preventDefault();

            const text = event.clipboardData.getData('text/plain');

            document.execCommand('insertText', false, text);
        });

    });

    inputToggles.forEach(function (toggle) {

        toggle.addEventListener("click", function () {

            if (toggle.classList.contains("active")) {
                toggle.classList.remove("active");
            } else {
                toggle.classList.add("active");
            }

        });

    });

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