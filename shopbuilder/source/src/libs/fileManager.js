import {typeTranslation} from "../common/ui/items_viewer";
import helpers from "./helpers";
import {encode, decode, labels} from "windows-1252";

import db from "./db";

function patch1252(content) { 
  
    content = encode(content,{
        mode: 'replacement'
    });
    
    // Combine the BOM and the encoded content
    // Byte Order Mark (BOM) for Windows-1252
    const bom = new Uint8Array([0x81, 0x8D, 0x8F, 0x90, 0x9D]); 

    // Combine the BOM and the encoded content
    const combinedData = new Uint8Array(bom.length + content.length);
    combinedData.set(bom, 0);
    combinedData.set(content, bom.length); 
    return combinedData;
}

const save2File = (name, content) => {
    let blob;
    
    let newContent = patch1252(content);
    
    blob = new Blob([newContent], {type: "text/csv;charset=windows-1252"});
 

    // Create a Blob from the Uint8Array
    //const blob = new Blob([uint16ArrayData], { type: "text/csv;charset=windows-1252" });

    // Create a URL for the Blob
    const blobUrl = URL.createObjectURL(blob);

    // Create an anchor element for the download link
    const a = document.createElement("a");
    a.href = blobUrl;

    // Set the desired file name for the download
    a.download = name; // Change the filename and extension as needed

    // Trigger a click event to initiate the download
    a.click();

    // Clean up the URL object to free up resources
    URL.revokeObjectURL(blobUrl);
};

const loadData = async (zipData, onDone) => {

    let readProgressBar = $("#readProgressBar .progress-bar");


    // Load the ZIP data with JSZip
    const zip = new JSZip();
    await zip.loadAsync(zipData);

    // Create a TextDecoder with Windows-1252 encoding
    const textDecoder = new TextDecoder('windows-1252');
        
    // An array of promises to track the decoding process
    const decodePromises = [];

    // Iterate through the files in the ZIP
    let counter = 0, total = 0;

    // Iterate through all the file names in the ZIP archive
    zip.forEach((relativePath, file) => {
        // Increment the counter for each file found
        total++;
    });


    let output = {};
    let acceptedFiles = ["goldequip","platinaequip"]; //Object.keys(typeTranslation);
    acceptedFiles = Object.keys(typeTranslation);
    acceptedFiles.push("buysell");
    acceptedFiles.push("goods");
    zip.forEach((fileName, file) => { 
        // Check if the file is a .txt file
        if (fileName.endsWith('.txt')) {

            let found = acceptedFiles.filter(v => fileName.indexOf(v) !== -1);
            if (found.length === 0){
                counter++;
                return;
            }

            // Read the content of the text file as an ArrayBuffer
            const arrayBufferPromise = file.async('arraybuffer');
    
            // Decode the content using Windows-1252 encoding
            const decodePromise = arrayBufferPromise.then((arrayBuffer) => {
                const decodedText = textDecoder.decode(arrayBuffer);
                
                if (fileName.indexOf("goods") === -1 && fileName.indexOf("buysell") === -1 && decodedText.indexOf("ItemGenre") === -1){
                    counter++;
                    return true;
                }


                //output[fileName] = helpers.tcvn32unicode(decodedText).split(/\r?\n/).filter(Boolean);
                output[fileName] = decodedText.split(/\r?\n/).filter(Boolean);
                counter++;
                let progress = Math.floor(counter*100/total);
                readProgressBar.css("width", progress+"%").text(progress+"%").closest('div').attr('aria-valuenow', progress);
 
            });
    
            decodePromises.push(decodePromise);
        }
        else{
            counter++;
        }
    });

    // Wait for all decodePromises to complete
    await Promise.all(decodePromises); 

    readProgressBar.css("width","0").text("");
    

    onDone(output);
}
const thisLib = {

 
    readZipFileFromURL: async(target, onDone) => {
        const response = await fetch(target);
        if (!response.ok) {
            throw new Error(`Failed to fetch the ZIP file (HTTP status: ${response.status}).`);
        }
        loadData(response.arrayBuffer(), onDone);
    },

    readZipFileFromLocal: async(zipFile, onDone) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const zipData = event.target.result;
            // Process the zip data, e.g., using a library like JSZip
            loadData(zipData, onDone);
        };
        reader.readAsArrayBuffer(zipFile);
    },

    save2File: save2File
};

 
export default thisLib;