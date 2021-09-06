/**
 * Pauses the code execution for a specific amount of time asynchronously.
 * @param {number} milliseconds
 * @example await waitFor(1000);
 */
export function waitFor(milliseconds) {

    return new Promise(function (resolve, reject) {

        if (typeof milliseconds == "number") {
            setTimeout(milliseconds, resolve);

            return;
        }

        reject("Required parameter is not a number.");

    });
}

/**
 * Generates a unique id
 * @param {string} len
 */
export function generateUniqueID(len) {

    if (typeof len !== "number") len = 8;

    let alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
        generatedID = "";

    for (let i = 0; i < len; i++)
        generatedID += alphabet.charAt(i);

    return generatedID;

}

/**
 * Returns a random number between two integers/
 * @param {number} number1
 * @param {number} number2
 */
export function rb(number1, number2) {
    if (typeof number1 == "number" && typeof number2 == "number") {
        let randomNumber = Math.floor(Math.random() * (number2 - number1 + 1) + number1);

        return randomNumber;
    }
}

/**
 * Returns a Atan 2 value.
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {object}
 */
export function pd(x1, y1, x2, y2) {

    const a = Math.atan2(y2 - y1, x2 - x1);

    return {
        formula: a,
        directionX: Math.cos(a),
        directionY: Math.sin(a),
        normalize: function () {
            return {
                directionX: parseFloat(this.directionX.toFixed(2)),
                directionY: parseFloat(this.directionY.toFixed(2)),
            }
        },
        complete: function () {
            return {
                directionX: parseInt(this.directionX),
                directionY: parseInt(this.directionY)
            }
        },
        addLength: function (len) {

            if (typeof len == "number") {
                return {
                    directionX: this.directionX * len,
                    directionY: this.directionY * len
                }
            } else {
                return this;
            }
        }
    }
}

/**
 * Resolves distance between two points.
 * @param {number} x1
 * @param {number} x2
 * @param {number} y1
 * @param {number} y2
 */
export function getDistance(x1, x2, y1, y2) {
    if (typeof x1 == "number" && typeof x2 == "number" && typeof y1 == "number" && typeof y2 == "number") {

        let d1 = x1 - x2,
            d2 = y1 - y2,
            distance = Math.sqrt(d1 * d1, d2 * d2);

        return distance;

    } else {
        return 0;
    }
}