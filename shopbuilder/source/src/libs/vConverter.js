import CACHE from "../common/cache";

let thisLib = {};

//Buysell.txt: alot of column shifting
thisLib.patchGoodsTxt = (inpData) => {

    // Fix to have shop comment
    let missing = 0;
    $.each(inpData, function(k,v){
        if (v.length > 20){
            missing++;
        }
        else{
            missing--;
        }
    });

    if (missing < inpData.length/2){
        let newData = [];
        $.each(inpData.slice(), function(k,v){
            let row = Array(27).fill("");
            row[0] = v[0];
            row[1] = v[1];
            row[2] = v[2];
            row[3] = v[3];
            row[4] = v[4];
            
            row[6] = v[5];
            row[7] = v[6];
            row[8] = v[7];
            row[9] = v[8];
            row[10] = v[9];
            row[25] = v[10];
            row[12] = v[11];
            row[13] = v[12];
            row[14] = v[13];
            
            row[22] = v[14];
            row[23] = v[15];
            row[26] = v[16]; 
            newData.push(row);

        }); 
        CACHE.data.goodsData = newData;

 
        return true;
        
    }

    return false;
};

thisLib.undoPatchGoodsTxt = (inpData) => { 
 
    let newData = []; 
    $.each(inpData, function(k,v){
        let row = Array(17).fill("");

        row[0] = v[0];
        row[1] = v[1];
        row[2] = v[2];
        row[3] = v[3];
        row[4] = v[4];
        
        row[5] = v[6];
        row[6] = v[7];
        row[7] = v[8];
        row[8] = v[9];

        row[9] = v[10];
        row[10] = v[25];
        row[11] = v[12];
        row[12] = v[13];
        row[13] = v[14];
        
        row[14] = v[22];
        row[15] = v[23];
        row[16] = v[26]; 
        newData.push(row);

    });
    return newData;
 
};



// Goods.txt : there's no first column to indicate name
thisLib.patchBuySellTxt = (inpData) => {

    // Fix to have shop comment
    let missing = 0;
    $.each(inpData, function(k,v){
        if (typeof v[0] === "string"){
            missing++;
        }
        else{
            missing--;
        }
    });

    if (missing < inpData.length/2){
        inpData = inpData.map((v,k)=>{
            if (k === 0){
                v.unshift("Name")
            }
            else{
                v.unshift("");
            }
            return v;
        });
        CACHE.data.buysellData = inpData;
        return true;
    }

    return false;

};
thisLib.undoPatchBuySellTxt = (inpData) => { 
    return inpData.slice().map((v)=>{
        v.shift();
        return v;
    });
};

export default thisLib;