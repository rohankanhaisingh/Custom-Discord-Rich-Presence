/**
 * Handles inputfield
 * @param {Array} inputfields
 */
export function handle(inputfields) {

    const tempObject = {};

    inputfields.forEach(function (field) {

        let inputType = field.getAttribute("data-type"),
            inputValue = field.innerText,
            parsedValue = inputValue,
            fieldId = field.getAttribute("data-id");

        switch (inputType) {

            case "number":

                parsedValue = parseFloat(inputValue);

                if (isNaN(parsedValue)) parsedValue = Date.now();

                break;

        }

        tempObject[fieldId] = parsedValue;

    });

    return tempObject;

}