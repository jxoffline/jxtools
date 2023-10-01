
import "./index.scss";
import buysell_editor from "./buysell_editor";
import goods_editor from "./goods_editor";
import items_viewer from "./items_viewer";
import magicscript_editor from "./magicscript_editor";

import CACHE from "../cache";
import ll from "../../libs";



const thisLib = {
    init: (onHavingData, onDone) =>{
        $("#downloadAllv6").click(function(){  
            ll.fileManager.save2File("goods.txt", ll.helpers.arrayToCSV(ll.vConverter.undoPatchGoodsTxt(CACHE.data.goodsData)));
            ll.fileManager.save2File("buysell.txt", ll.helpers.arrayToCSV(ll.vConverter.undoPatchBuySellTxt(CACHE.data.buysellData)));
        });
        $("#downloadAllv8").click(function(){  
            ll.fileManager.save2File("goods.txt", ll.helpers.arrayToCSV(CACHE.data.goodsData));
            ll.fileManager.save2File("buysell.txt", ll.helpers.arrayToCSV(CACHE.data.buysellData));
        });
        $("#downloadMagicScript").click(function(){  
            ll.fileManager.save2File("magicscript.txt", ll.helpers.arrayToCSV(CACHE.data.magicscript));
        });
        
        $("#backHome").click(()=>{
            CACHE.data = {};
            $("#zip004Input").val("");
            $("body").removeClass("loadedData");
        });

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

        $("#huongdan-tab-pane a[dTarget]").click(function(e){
            e.preventDefault();
            e.stopPropagation();
            let target = $(this).attr("dTarget");
            $(target).click();
        });

        // Get the file input element
        var fileInput = document.getElementById('zip004Input');

        // Add an event listener for the 'change' event
        fileInput.addEventListener('change', function (event) {
            _.defer(()=>{
                $("#uploadButton").click();
            }, 1);
        });

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
    }
    
};

export default thisLib;