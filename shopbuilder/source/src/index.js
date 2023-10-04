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

const buildDataCache = () =>{

    // Display the decoded content in the output div
    CACHE.data.allItems = {}; 
    CACHE.data.allItemKeysByType = {}; 
    CACHE.data.allItemsKey = [];

    // Process other fields
    $.each(CACHE.data.others, (fileName, rows)=>{

        let itemType = ll.helpers.getFileName(fileName).replace(".txt","");
        
        if (itemType == "platinaequip") itemType = "goldequip";
        
        for (let index=0; index<rows.length; index++){
            // Is this first row?
            if (index == 0){
                continue;
            }        
            let row = rows[index];
            CACHE.addItemToCachePool(itemType, row, index);
        }
    });

    // Process magicscript
    let rows = CACHE.data.magicscript,
        itemType = 'magicscript';
    for (let index=0; index<rows.length; index++){
        // Is this first row?
        if (index == 0){
            continue;
        }        
        let row = rows[index];
        CACHE.addItemToCachePool(itemType, row, index);
    }
     
    // Build codes key
    $.each(CACHE.data.allItems, (itemID, data)=>{
        let itemType = data.__type;
        if (!CACHE.data.allItemKeysByType[itemType]) CACHE.data.allItemKeysByType[itemType] = [];
        CACHE.data.allItemKeysByType[itemType].push(itemID);
    });
    
    // Then sort them
    let items = Object.keys(CACHE.data.allItems);
    items.sort();
    CACHE.data.allItemsKey = items; 

    llEvents.trigger("dataCache.changed"); 
};


const onHavingData = (output)=>{

    CACHE.data.others = {};


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
            continue;
        } 

        
        /*
            Normal item files
        */
        if (!c.length) continue;
        let firstRow = c[0].toLowerCase();

        // Not having correct column = not item files, skip
        if (firstRow.indexOf("itemgenre") === -1 || firstRow.indexOf("detailtype") === -1){
            continue;
        } 
        
        CACHE.data.others[fileName] = c.map(ll.helpers.parseCSVRow);
    }


    if (!CACHE.data.goodsData || !CACHE.data.goodsData.length){
        return true;
    }
    buildDataCache();
    
}
 

$(document).ready(()=>{
    
    // Set page version
    $("#pageTitle").text(CACHE.version);
    $("head title").text(CACHE.version);

    ll.db.init();

    let inited = false;
    const onDone = () => {
        if (inited) return;

        inited = true;
        // Tab 1: Item viewer
        UI.renderItemsViewer();

        // Tab 2: goods.txt
        UI.renderGoodsEditor();

        // Tab 3: buysell.txt
        UI.renderBuySellDropdown();

        // Tab 4: magicscript.txt
        UI.renderMagicScriptEditor();

        // Tab over: DB manager/cache
        UI.renderDBManager();

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
    

    

    // Magicscript was edited elsewhere? Re build inventory
    llEvents.on("magicscript.changed", ()=>{
        buildDataCache();
    });

    // Data cahced build?
    llEvents.on("dataCache.changed", ()=>{
        setTimeout(()=>{
            onDone();
        },1);
    });

    // Init every thing
    UI.init(onHavingData); 

    //LOCAL DEV:
    if (CACHE.isDEV){
        ll.fileManager.readZipFileFromURL("assets/server1.zip", (output)=>{
            onHavingData(output, onDone);
        });
    }
 
 
});
  