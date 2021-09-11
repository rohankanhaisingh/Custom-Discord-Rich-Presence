const electron = require("electron");

const { ipcRenderer } = electron;

const navbar = document.querySelector(".app-navbar"),
    profileNode = document.querySelector(".navbar-user-profile"),
    dropdownToggleButton = document.querySelector(".navbar-user-profile-button"),
    dropdown = document.querySelector(".navbar-user-profile-dropdown"),
    dropdownButtons = document.querySelectorAll(".navbar-user-profile-dropdown-button");

dropdownToggleButton.addEventListener("click", function () {

    if (!this.classList.contains("active")) {

        dropdown.classList.add("visible");
        profileNode.classList.add("active");

        this.classList.add("active");


    } else {
        dropdown.classList.remove("visible");
        profileNode.classList.remove("active");

        this.classList.remove("active");
    }

    dropdownButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const emitChannel = this.getAttribute("emit");

            ipcRenderer.send(emitChannel, "beans");

        });

    });

});