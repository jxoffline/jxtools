const thisLib = {
    isDEV: false,
	data: {},

    searchCache: {},
    getSearchToken : (code, v)=>{
        if (thisLib.searchCache[code]) return thisLib.searchCache[code];


        thisLib.searchCache[code] = (code.replace(/_/g," ")+v.name+v.spr).toLowerCase();

        return thisLib.searchCache[code];
    },


    addItemToCachePool: (itemType, row, index) => {

        // Not sufficient data?
        if (row.length < 3) return true;
        
        if (itemType === "goldequip"){                    
            row[1] = 16;
            row[2] = index;
            row[3] = 1;
        }



        let genre = row[1];
        let type = row[2];
        let spec = (itemType == "questkey") ? row[9] : row[3];
        
        // Read in this data for the row
        let m = {
            __type: ""+itemType,
            __source: "", //+fileName,
            name: ""+row[0],
            
            genre: genre,
            type: type,
            spec: spec ,
            kind: itemType == "huangjintupu" ? "" :  ((itemType == "questkey") ? 0 : row[9]),
            spr: itemType == "huangjintupu" ? "" : ((itemType == "questkey") ? row[3] : row[4]),
            level: itemType == "huangjintupu" ? "" :  ((itemType == "questkey") ? 0 : row[11]),
            script: row[13] || "",

        };
 
        
        let itemID = [m.genre, m.type, m.spec || 0, m.kind !== "" ? (m.kind || 0) : 0, m.level !== "" ? (m.level || 0) : 0].join("_");
        m.code = itemID;
        thisLib.data.allItems[itemID] = m;  
    },

    onCachePoolReady: () =>{

        $.each(thisLib.data.allItems, (itemID, data)=>{
            let itemType = data.__type;
            if (!thisLib.data.allItemKeysByType[itemType]) thisLib.data.allItemKeysByType[itemType] = [];
            thisLib.data.allItemKeysByType[itemType].push(itemID);
        });
        
        let items = Object.keys(thisLib.data.allItems);
        items.sort();
        thisLib.data.allItemsKey = items; 
    }
};

export default thisLib;