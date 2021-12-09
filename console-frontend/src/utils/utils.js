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

function setInLocalStorage(name, value) {
  localStorage.setItem(name, value);
}

function getFromLocalStorage(name) {
  return localStorage.getItem(name);
}

function jsonStringifyReplacer(key, value) {
  // Filtering out properties
  if (value === "") {
    return undefined;
  }
  return value;
}
function extractPageNumberFromString(str) {
  const indexPage = str.indexOf("page=");
  return str[indexPage + 5];
}

export default {
  isArray,
  isString,
  isObject,
  setInLocalStorage,
  getFromLocalStorage,
  jsonStringifyReplacer,
  extractPageNumberFromString,
};
