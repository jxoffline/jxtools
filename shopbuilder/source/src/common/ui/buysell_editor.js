import CACHE from "../cache";
import ll from "../../libs";

import {genRowHtml, getInfoOfItemFromGoodsData} from "./goods_editor";

let container, selectedShop,
    shopSelectionDropdown,
    goodsBuySellSelection;
  
const execAddSaleItem = (inp) => {
    if (CACHE.data.buysellData[selectedShop]){
        let found = false;
        $.each(CACHE.data.buysellData[selectedShop], (k,v)=>{
            if (k>0 && (v == '' || !v)){
                CACHE.data.buysellData[selectedShop][k]= inp;
                found = true;
                return false;
            }
        });
        if (!found){
            CACHE.data.buysellData[selectedShop].push(inp);
        }
    }
    
}

let boundEvent = false;
const bindEvents = ()=>{
    if (boundEvent) return;
    boundEvent = true;

	llEvents.on("buysell.update", _.debounce(()=>{
		thisLib.show();
	}, 1000));

    // Shop: chon
    shopSelectionDropdown.change(function(){
         // Get the selected value
        let selectedValue = $(this).val();

        // Find the selected option element
        let selectedOption = $(this).find('option[value="' + selectedValue + '"]');

        
        $("#selectedShopName").text(selectedOption.text());
        thisLib.show(selectedValue);


    });

    // Shop: tao
    $("#createNewShop").click(()=>{
        let inp = $("#createNewShopInp").val();        
        CACHE.data.buysellData.push([inp]);

        let newIndex = CACHE.data.buysellData.length - 1;
        shopSelectionDropdown.append(`<option value="${newIndex}">Shop ${newIndex} - ${inp}</option>`);        
        shopSelectionDropdown.val(newIndex).change();
        goodsBuySellSelection.append(`<option value="${newIndex}">Shop ${newIndex} - ${inp}</option>`);        
        goodsBuySellSelection.val(newIndex).change();
        
        
    });

    // Shop: xoa
    $("#deleteShop").click(()=>{
        CACHE.data.buysellData.splice(selectedShop, 1);
        selectedShop = false;
        generateSelectionDropdownContent();
    });

    // Shop item: xoa vat pham
    container.on("click", ".deleteGood", function(e){
        e.preventDefault();
        e.stopPropagation();

        let valueToRemove = parseInt($(this).closest(".dataRow").attr("forID"), 10);
        let myArray = CACHE.data.buysellData[selectedShop];

        // Find the index of the value you want to remove
        let indexToRemove = valueToRemove;

        // Check if the value was found in the array        
        myArray.splice(indexToRemove+1, 1); 

        CACHE.data.buysellData[selectedShop] = myArray;
        thisLib.show(selectedShop);

    });

    // Shop item: them vat pham
    let addNewGoodToShopInp = $("#addNewGoodToShopInp");    
    addNewGoodToShopInp.select2($.extend({}, window.llGlobal, {
        
        ajax: {
            delay: 500,
            cache: true,
            url: function (params) {
                return '';
            },
            processResults: function (data, params) {
                

                let enteredKW = params.term;
    
                let output = [];

                if (enteredKW !== ""){
                    enteredKW = ll.helpers.u2t(enteredKW);

                    $.each(CACHE.data.goodsData, function(k,data){
                        if (k===0) return true;
                        let v = data.slice();
                        let t = v.join(" ") + k; 
                        if (t.toLowerCase().indexOf(enteredKW.toLowerCase()) !== -1){
                            output.push({
                                text: ll.helpers.t2u(v[26]) + " ("+k+") ",
                                id: k,
                            });
                        }
                    }); 
                } 
                
                return {
                    results: output
                };
            }
        }
    }));
    addNewGoodToShopInp.on('select2:select', function (e) {
        // Access the selected data
        const selectedData = e.params.data;
        execAddSaleItem(selectedData.id);
        thisLib.show();
    });

    $("#addNewGoodToShop").click(()=>{
        const selectedData = addNewGoodToShopInp.val();
        execAddSaleItem(selectedData);
        thisLib.show();
    });

};


const onReplaceItem = (fromID, toID) => {
    
    fromID = parseInt(fromID, 10);
    toID = parseInt(toID, 10);
    CACHE.data.buysellData[selectedShop][fromID+1] = toID;
    CACHE.data.buysellData[selectedShop] = CACHE.data.buysellData[selectedShop].map((v,k)=>{
        if (k == 0) return v;
        try{
            v = parseInt(v,10);
            return v > 0 ? v : '';
        }
        catch{
            return '';
        }
        
    });
    thisLib.show();
};

const generateSelectionDropdownContent = () =>{
    shopSelectionDropdown.empty();
	
    goodsBuySellSelection.empty();
	
	let latest="";
    if (CACHE.data.buysellData){

        CACHE.data.buysellData.forEach((shopD, index) => {
            if (index == 0) return true;
            if (shopD.length <= 1) return true;
            let name = ll.helpers.t2u(""+shopD[0]);
            shopSelectionDropdown.append(`<option value="${index}">CH ${index} - ${name}</option>`);
            goodsBuySellSelection.append(`<option value="${index}">CH ${index} - ${name}</option>`);
			
			latest = index;
        }); 
    }
    shopSelectionDropdown.val(CACHE.isDEV ? 140 : latest).change();
    goodsBuySellSelection.val(CACHE.isDEV ? 140 : latest).change();
}

const thisLib = {
    init: (c) => {
        if (c) container = c;
        shopSelectionDropdown = $("#shopSelect");   
        goodsBuySellSelection = $("#buysellSelection");
        bindEvents();
             
        generateSelectionDropdownContent(); 
    },

    show: (shopIndex) => {  
        container.empty();

        if (shopIndex) selectedShop = shopIndex;
        if (shopIndex === "") return true;
 
        selectedShop = parseInt(selectedShop);
        if (!CACHE.data.buysellData || !CACHE.data.buysellData[selectedShop]) return;

        let itemsToDisplay = CACHE.data.buysellData[selectedShop].slice();
        itemsToDisplay.shift(); // remove the name
        itemsToDisplay = itemsToDisplay.filter((v)=>{return v && v!="";});

        let html = "<ul id='buysellTable' class='baseTableShop'>";
        html += genRowHtml({
            name: "Tên",
            index: "ID",
            data: [],
            isFirstRow: true,
            id: "ID"
        });   
        
        itemsToDisplay.forEach((v, k) => { 
            let item = getInfoOfItemFromGoodsData(k, CACHE.data.goodsData[v]);
            // Neu ko co item nay trong goods.txt? Skip
            if (!item){
                return true;
            }
            CACHE.data.goodsData[v][26] = item.name;

            let renderdObj = JSON.parse(JSON.stringify(item));
            renderdObj.name = renderdObj.name +  " (" + v + ")"
            html +=  genRowHtml(renderdObj); 
        });
        html += "</ul>";
        container.html(html);

        // Drag and drop
        let ul = container.find("ul"),
            onUpdateOrder = ()=>{
                let newData = [];
                ul.find("li").each(function(){
                    let id = $(this).attr("forId");
                    if (id === "ID"){
                        newData.push(CACHE.data.buysellData[selectedShop][0]);
                        return true;
                    }

                    newData.push(CACHE.data.buysellData[selectedShop][parseInt(id,10)+1]);
                });
                CACHE.data.buysellData[selectedShop] = newData;
                thisLib.show();
                 
            };
        ul.sortable({
            update: function(event, ui) {
                //data changed
                onUpdateOrder();
            }
        });

        container.find(".searchItem").select2($.extend({}, llGlobal, { 
            ajax: {
                delay: 500,
                cache: true,
                url: function (params) {
                  return '';
                },
                processResults: function (data, params) {
                    

                    let enteredKW = params.term;
        
                    let output = [];

                    if (enteredKW !== ""){

                        enteredKW = ll.helpers.u2t(enteredKW);
                        $.each(CACHE.data.goodsData, function(k,data){
                            if (k===0) return true;
                            let v = data.slice();
                            let t = v.join(" "); 
                            if (t.toLowerCase().indexOf(enteredKW.toLowerCase()) !== -1){
                                output.push({
                                    text: ll.helpers.t2u(v[26]) + " ("+k+") ",
                                    id: k,
                                });
                            }
                        }); 
                    } 
                    
                    return {
                        results: output
                    };
                }
            }
        }));
        
        container.find(".searchItem").on('select2:select', function (e) {
            // Access the selected data
            const selectedData = e.params.data;
    
            // Access the specific dropdown that triggered the event using 'this'
            const $selectedDropdown = $(this);

            onReplaceItem($selectedDropdown.attr('forID'), selectedData.id);
        });

    }
};


export default thisLib;