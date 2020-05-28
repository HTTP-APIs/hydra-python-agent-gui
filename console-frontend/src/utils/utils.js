//todo Import localstorage helper functions here

function isArray(value) {
    // utility method that returns boolean value
    return value && typeof value === "object" && value.constructor === Array;
}

function isString(value) {
    // utility method that returns boolean value
    return typeof value === "string" || value instanceof String;
}
function isObject(value) {
    // utility method that returns boolean value
    return value && typeof value === "object" && value.constructor === Object;
}

function setInLocalStorage(name, value){
    localStorage.setItem(name, value);
}

function getFromLocalStorage(name){
    return localStorage.getItem(name);
}

module.exports = {
    isArray: isArray,
    isString: isString,
    isObject: isObject
}
