const { toUnicode, toTCVN3 } = require("vietnamese-conversion");

// Function to convert a UTF-8 string to Windows-1252 encoding
export const tcvn3_to_utf8 = (inp) => {
    return toUnicode(inp, "tcvn3");
}

// Function to convert a Windows-1252 string to UTF-8 encoding
export const utf8_to_tcvn3 = (inp) => {
    return toTCVN3(inp, "unicode");
}
