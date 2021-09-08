import { waitFor } from "./essentials.js";
import { emitData, listen } from "./iohandler.js";

const inputField = document.querySelector(".login-inputfield"),
    postButton = document.querySelector(".login-button"),
    loader = document.querySelector(".app-loader");

window.addEventListener("load", function () {

    /**
 * Animates inputfield
 * @param {"error"} animationName
 */
    function animateInputField(animationName) {

        switch (animationName) {
            case "error":

                if (!inputField.classList.contains("error")) {

                    inputField.classList.add("error");

                    setTimeout(function () {

                        inputField.classList.remove("error");

                    }, 1000);

                }

                break;
        }

    }

    function checkInputField() {

        if (!postButton.classList.contains("active")) postButton.classList.add("active");

        const value = inputField.innerText;

        if (typeof value == "string") {
            if (value.length == 18) {
                login(value);
            } else {
                postButton.classList.remove("active");

                animateInputField("error");
            }
        } else {
            postButton.classList.remove("active");

            alert("app_parserror: no string");
        }
    }

    function login(id) {

        emitData("discord:login", {
            clientID: id,
            emitTimestamp: Date.now()
        });

    }

    listen("discord:logged_in", function (client) {

        console.log("Succefully initialized Discord client.");

        // Animation page switching transition.
        loader.classList.remove("hidden");

        setTimeout(function () {
            emitData("app:changeWindowURL", true);
        }, 1000);
    });

    postButton.addEventListener("click", checkInputField);

    inputField.addEventListener("keydown", function (event) {

        switch (event.keyCode) {
            case 13:

                event.preventDefault();

                checkInputField();

                break;
        }

    });

});