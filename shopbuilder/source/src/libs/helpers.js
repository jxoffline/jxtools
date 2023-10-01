const { toUnicode, toTCVN3 } = require('vietnamese-conversion');



// Function to convert a UTF-8 string to Windows-1252 encoding
function my_t2u(inp) {
  return toUnicode(inp, "tcvn3");
}

// Function to convert a Windows-1252 string to UTF-8 encoding
function my_u2t(inp) {
  return toTCVN3(inp, "unicode");
}

 

const thisLib = {

    t2u: my_t2u,
    u2t: my_u2t,

    getFileName: (filePath) => {
        // Use the `split` method to split the file path by the slash (or backslash) character
        // This will create an array of parts, and the last part will be the file name
        const pathParts = filePath.split(/[\\/]/);
        const fileName = pathParts[pathParts.length - 1];
        return fileName;
    },
    parseCSVRow: (row) => {

        /*let values = $.csv.toArray(row, { 
          separator: "\t", // Sets a custom value delimiter character
        });*/

        // Split the row by tabs to separate the values
        const values = row.split('\t');
        
        // Parse and convert values to their appropriate types
        const parsedValues = values.map(value => {
          // Attempt to convert to a number if it's a numeric string
          const parsedNumber = parseFloat(value);
          if (!isNaN(parsedNumber) && String(parsedNumber) === value) {
            return parsedNumber;
          }
          
          // Attempt to convert to a boolean if it's a boolean string ("true" or "false")
          if (value === 'true' || value === 'false') {
            return value === 'true';
          }
          
          // If no conversion is possible, keep it as a string
          return value;
        });
        
        // Return an array of values with preserved types
        return parsedValues;
    },



    arrayToCSV: (csvData) => {


      // Step 1: Find the maximum length among child arrays
      const maxLength = Math.max(...csvData.map((row) => row.length));

      // Step 2: Pad shorter child arrays to match the maximum length
      const paddedCsvData = csvData.map((row) => {
        while (row.length < maxLength) {
          row.push(""); // You can use any value to pad, e.g., empty string
        }
        return row;
      });

      let content = paddedCsvData
        .map((row) => row.join("\t"))
        .join("\r\n");
      //return thisLib.unicode2tcvn3(content+"\r\n");
      return content;

    }


}


export default thisLib;