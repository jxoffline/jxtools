import './index.scss';
import "./global";
import ll from "./libs";
import CACHE from "./common/cache";
import UI from "./common/ui";
 
// Define a custom comparator function for sorting
function customSort(a, b) {
    // Count the number of slashes in each string
    const slashesA = (a.match(/\//g) || []).length;
    const slashesB = (b.match(/\//g) || []).length;
  
    // Compare based on the number of slashes
    if (slashesA < slashesB) {
      return -1;
    } else if (slashesA > slashesB) {
      return 1;
    } else {
      // If the number of slashes is the same, use alphabetical order
      return a.localeCompare(b);
    }
  }



const onHavingData = (output, onDone)=>{

    // Display the decoded content in the output div
    CACHE.data.allItems = {}; 
    CACHE.data.allItemKeysByType = {}; 

    // Get the keys of the object
    const fileNames = Object.keys(output);

    // Sort the keys alphabetically
    fileNames.sort(customSort);

    // Loop through the sorted keys in alphabetical order
    for(let i = 0; i<fileNames.length; i++) {
        let fileName = fileNames[i];
        
        let c = output[fileName]; 
        let itemType = ll.helpers.getFileName(fileName).replace(".txt","");
        
        if (itemType == "platinaequip") itemType = "goldequip";
            
        /*
            Special files?
            */
        if (itemType === "goods"){
            CACHE.data.goodsData = c.map(ll.helpers.parseCSVRow);
            if (ll.vConverter.patchGoodsTxt(CACHE.data.goodsData)){
                CACHE.v6 = true;
            }
            continue;
        }
        if (itemType === "buysell"){
            CACHE.data.buysellData = c.map(ll.helpers.parseCSVRow);
            
            if (ll.vConverter.patchBuySellTxt(CACHE.data.buysellData)){
                CACHE.v6 = true;
            }
            continue;
        }

        if (itemType === "magicscript"){
            CACHE.data.magicscript = c.map(ll.helpers.parseCSVRow);  
        } 
        
        /*
            Normal item files
        */

        for (let index=0; index<c.length; index++){
            let oRow = c[index];

            // Not having correct column = not item files, skip
            if (index == 0 && oRow && (oRow.toLowerCase().indexOf("itemgenre") === -1 || oRow.toLowerCase().indexOf("detailtype") === -1)){
                break;
            } 

            // Otherwise read it in
            let row = ll.helpers.parseCSVRow(oRow);

            // Is this first row?
            if (index == 0){
                continue;
            }        
            CACHE.addItemToCachePool(itemType, row, index);
        }
    }

    CACHE.onCachePoolReady();

    if (!CACHE.data.goodsData || !CACHE.data.goodsData.length){
        return true;
    }
    onDone();
    
}
 

$(document).ready(()=>{
    

    const onDone = () => {

        // Tab 1: Item viewer
        UI.renderItemsViewer();

        // Tab 2: goods.txt
        UI.renderGoodsEditor();

        // Tab 3: buysell.txt
        UI.renderBuySellDropdown();

        // Tab 4: magicscript.txt
        UI.renderMagicScriptEditor();

        // Focus to buysell
        if (CACHE.isDEV){
            $("#magicscript-tab").click();
        }
        else{
            $("#goods-txt-tab").click();
        }
        //$("#item-viewers-tab").click();

        $("body").addClass("loadedData");
    }; 
    

    UI.init(onHavingData, onDone); 

    //LOCAL DEV:
    if (CACHE.isDEV){
        ll.fileManager.readZipFileFromURL("assets/files/server1.zip", (output)=>{
            onHavingData(output, onDone);
        });
    }
 
 
});
  