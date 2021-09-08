import "./essentials.js";
import { handle } from "./handleInputfields.js";
import { emitData, listen } from "./iohandler.js";

const inputFields = document.querySelectorAll(".visualizer-inputfield"),
    buttons = document.querySelectorAll(".visualizer-button"),
    loader = document.querySelector(".app-loader");

window.addEventListener("load", function () {

    // Requesting data from the server.
    emitData("discord:getClientData");
    emitData("app:getPresenceData");

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

        console.log(data);

        const presenceData = data.presence;

        for (let key in presenceData) {

            inputFields.forEach(function (field) {

                const fieldAttr = field.getAttribute("data-bind");

                if (fieldAttr == key) {
                    field.innerHTML = presenceData[key];
                }

            });

        }

    });



    buttons.forEach(function (button) {

        const buttonID = button.getAttribute("data-id");

        button.addEventListener("click", function () {

            switch (buttonID) {
                case "discord-rpc-update":

                    const obj = handle(inputFields);

                    emitData("app:update_presence", obj);

                    break;
            }

        });

    });


});