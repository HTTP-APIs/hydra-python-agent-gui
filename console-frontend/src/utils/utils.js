const isArray = (value) => {
  // utility method that returns boolean value
  return value && typeof value === "object" && value.constructor === Array;
}

const isString = (value) => {
  // utility method that returns boolean value
  return typeof value === "string" || value instanceof String;
}
const isObject = (value) => {
  // utility method that returns boolean value
  return value && typeof value === "object" && value.constructor === Object;
}

const setInLocalStorage = (name, value) => {
  localStorage.setItem(name, value);
}

const getFromLocalStorage = (name) => {
  return localStorage.getItem(name);
}

const jsonStringifyReplacer = (key, value) => {
  // Filtering out properties
  if (value === "") {
    return undefined;
  }
  return value;
}
const extractPageNumberFromString = (str) => {
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
