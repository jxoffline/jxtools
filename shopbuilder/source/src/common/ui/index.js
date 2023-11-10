
import "./index.scss";
import buysell_editor from "./buysell_editor";
import goods_editor from "./goods_editor";
import items_viewer from "./items_viewer";
import magicscript_editor from "./magicscript_editor";
import db_manager from "./db_manager";

import CACHE from "../cache";
import ll from "../../libs";

const bindEvents = (onHavingData, onDone) =>{

    // Download btn buysell+shop for V6
    $("#downloadAllv6").click(function(){  
        
        // Function to encode a string as Uint8Array with Windows-1252 encoding
        ll.db.save("goods.txt", CACHE.data.goodsData);
        ll.db.save("buysell.txt", CACHE.data.buysellData);  

        ll.fileManager.save2File("goods.txt", ll.helpers.arrayToCSV(ll.vConverter.undoPatchGoodsTxt(CACHE.data.goodsData)));
        ll.fileManager.save2File("buysell.txt", ll.helpers.arrayToCSV(ll.vConverter.undoPatchBuySellTxt(CACHE.data.buysellData)));
    });

    // Download btn buysell+shop for V8
    $("#downloadAllv8").click(function(){  
        ll.db.save("goods.txt", CACHE.data.goodsData);
        ll.db.save("buysell.txt", CACHE.data.buysellData);  

        ll.fileManager.save2File("goods.txt", ll.helpers.arrayToCSV(CACHE.data.goodsData));
        ll.fileManager.save2File("buysell.txt", ll.helpers.arrayToCSV(CACHE.data.buysellData));
    });

    // Download btn magicscript
    $("#downloadMagicScript").click(function(){  

        ll.db.save("magicscript.txt", CACHE.data.magicscript);

        ll.fileManager.save2File("magicscript.txt", ll.helpers.arrayToCSV(CACHE.data.magicscript)+"\r\n");
    });
    
    // Thoát btn everything
    $("#backHome").click(()=>{
        CACHE.data = {};
        $("#zip004Input").val("");
        $("body").removeClass("loadedData");
    });

    // Page 1: upload file zip action
    var myButton = document.getElementById('uploadButton');
    // Create a popover instance
    var popover = new bootstrap.Popover(myButton, {
        placement: 'right',
        content: 'Ủa gì dợ ? File đâu?',
        trigger: 'manual' // Set trigger to 'manual' to control when to show and hide
    }); 
    $("#uploadButton").click(() => {
        const inputElement = document.getElementById("zip004Input");
        const zipFile = inputElement.files[0];    
        
        // Check if a file was selected
        if (zipFile) {
            ll.fileManager.readZipFileFromLocal(zipFile, (output)=>{
                onHavingData(output, onDone);
            }); 
        }else{
            popover.show();
            setTimeout(()=>{
                popover.hide();
            }, 5000);
        }
    });
    // Get the file input element
    var fileInput = document.getElementById('zip004Input');
    // Add an event listener for the 'change' event
    fileInput.addEventListener('change', function (event) {
        _.defer(()=>{
            $("#uploadButton").click();
        }, 1);
    });

    // Misc: hot shortcut
    $("#huongdan-tab-pane a[dTarget]").click(function(e){
        e.preventDefault();
        e.stopPropagation();
        let target = $(this).attr("dTarget");
        $(target).click();
    });


};

const thisLib = {
    init: (onHavingData, onDone) =>{
        bindEvents(onHavingData, onDone);
    },
    renderBuySellDropdown: () => {     
        buysell_editor.init($("#buysellEditor"));
        
    },
    renderItemsViewer: () => {
        items_viewer.show($("#itemViewer"), 1);
    },
    renderGoodsEditor: () => {
        goods_editor.show($("#goodsEditor"));
    },

    renderMagicScriptEditor: ()=>{
        magicscript_editor.show($("#magicscriptEditor"));
    },

    renderDBManager: () =>{
        db_manager.init()
    }
    
};

export default thisLib;