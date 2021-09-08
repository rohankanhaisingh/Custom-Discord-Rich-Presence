import "./essentials.js";
import { emitData, listen } from "./iohandler.js";

const inputFields = document.querySelectorAll(".visualizer-inputfield"),
    buttons = document.querySelectorAll(".visualizer-button"),
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
            profilePictureNode = document.querySelector(".discord-visualizer-profile-picture img");


        profilePictureNode.src = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.gif`;

        profileNameNode.innerHTML = `<span>${data.username}#<b>${data.discriminator}</b></span>`;

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

window.addEventListener("load", function () {

    // Requesting data from the server.
    emitData("discord:getClientData");
    emitData("app:getPresenceData");

    startListeners();
    keyboardHandlers();


    buttons.forEach(function (button) {

        const buttonID = button.getAttribute("data-id");

        button.addEventListener("click", function () {

            switch (buttonID) {
                case "discord-rpc-update":

                    const obj = handleInputFields(inputFields);


                    emitData("app:update_presence", obj);

                    break;
            }

        });

    });


});