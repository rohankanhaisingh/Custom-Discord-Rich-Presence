import "./essentials.js";
import { handle } from "./handleInputfields.js";
import { emitData } from "./iohandler.js";

const inputFields = document.querySelectorAll(".visualizer-inputfield"),
    buttons = document.querySelectorAll(".visualizer-button");

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