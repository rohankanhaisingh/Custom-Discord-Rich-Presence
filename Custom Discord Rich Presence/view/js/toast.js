import { generateUniqueID } from "./essentials.js";

const toasts = [];

/**
 * Creates a html node
 * @param {string} nodeName
 * @param {string} className
 * @param {object} attributes
 * @param {string | undefined} text
 */
function createNode(nodeName, className, attributes, text) {

    const em = document.createElement(nodeName);

    em.className = className;

    if (typeof attributes == "object") {

        for (let attr in attributes) {
            em.setAttribute(attr, attributes[attr]);
        }

    }

    if (typeof text !== "undefined") {
        em.innerText = text;
    }

    em.appendTo = function (node) {
        if (node instanceof HTMLElement) {

            node.appendChild(em);


            return em;
        }
    }

    return em;

}

/**
 * Parses url format.
 * @param {string} url
 */
function parseUrlFormat(url) {

    const base = url.substring(5);

    switch (base) {
        case "discord":
            return "./data/images/discord.png";
            break;
    }

}

export class Toast {
    /**
     * HTML toast node.
     * @param {string} title
     * @param {string} details
     * @param {string} icon
     * @param {number | null} duration
     */
    constructor(title, details, icon, duration) {

        this.title = title;
        this.details = details;
        this.icon = icon.includes("icon:") ? parseUrlFormat(icon) : icon;
        this.duration = typeof duration === "number" ? duration : 3000;

        this.node = null;

        this.id = generateUniqueID(18);
        this.creationTimestamp = Date.now();

        toasts.push(this);

        this.createNode();
    }
    createNode() {

        const mainToastNode = createNode("div", "app-toast").appendTo(document.querySelector(".app-toasts-container")),
            mainToastNodeContainer = createNode("div", "container").appendTo(mainToastNode);

        const toastIcon = createNode("div", "toast-icon").appendTo(mainToastNodeContainer),
            toastIconImage = createNode("img", "beans", { src: this.icon }).appendTo(toastIcon);

        // For some reason, the 'appendTo' method totally breaks here so I gotta use the default append method. And honestly, I dont wanna bother myself fixing this lol.

        const toastContent = createNode("div", "toast-content");
        mainToastNodeContainer.appendChild(toastContent);

        const toastTitle = createNode("div", "toast-title"),
            toastTitleNode = createNode("span", "beans", 0, this.title),
            toastHl = createNode("div", "toast-hl"),
            toastDetailsNode = createNode("div", "toast-details"),
            toastDetailsTextNode = createNode("span", "beans", null, this.details);

        toastContent.appendChild(toastTitle);
        toastContent.appendChild(toastHl);
        toastContent.appendChild(toastDetailsNode);

        toastTitle.appendChild(toastTitleNode);
        toastDetailsNode.appendChild(toastDetailsTextNode);

        this.node = mainToastNode;

        this.update();
    }
    update() {
        setTimeout(() => {

            this.destroy();

        }, this.duration);
    }
    destroy() {

        if (typeof this.node == "undefined") {

            this.node = null;

            return;
        }

        this.node.classList.add("fadeout");

        setTimeout(() => {
            this.node.remove();

            this.node = null;

            let i = 0;

            while (i < toasts.length) {

                const node = toasts[i];

                if (node.id == this.id) {
                    toasts.splice(i, 1);
                }

                i += 1;
            }

        }, 300);

    }
}