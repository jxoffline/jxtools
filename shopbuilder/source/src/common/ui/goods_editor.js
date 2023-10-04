import CACHE from "../cache";
import ll from "../../libs";
import buysel_editor from "./buysell_editor";

const goodsColumnRename = { 
    "6": "Tiền",
    "7": "P Duyên",
    "8": "Xu",
    "9": "Điểm TK",
    "10": "Vinh Dự",
    "11": "Cống hiến",
    "12": "Danh vọng",
    "13": "Điểm CT"
};

const noName = ll.helpers.u2t("(Chưa có tên)");


export const getInfoOfItemFromGoodsData = (rowID, item)=>{

    let name =  item[26] ? ""+item[26] : "";

    // Translate name?
    let code = [item[0], item[1], item[2] || 0, item[3] || 0, item[4] || 0].join("_");
    if (CACHE.data.allItems && CACHE.data.allItems[code]){
        name = CACHE.data.allItems[code].name;
    }
    if ($.trim(name) === ""){
        name = noName + " " + code;
    }
    
    let output = {
        name: name,
        index: rowID,
        data: item,
        code: code,
        type: CACHE.data.allItems && CACHE.data.allItems[code] ? CACHE.data.allItems[code].__type : "others"
    }; 

    return output;
};


export const genRowHtml = (item) => {

    let name = item.isFirstRow ? item.name : ll.helpers.t2u(item.name);

    let html = `<li class='dataRow isEditing ${changedRows[item.index] ? "isChanged":""}' forID='${item.index}'>`;

    // First column = name
    html += `
	
		<span class="colChose" title="Thêm vào buysell.txt">
			${item.isFirstRow ? "Thêm" : "<button class='btn btn-primary btn-sm add2BuySell' data-bs-container=\"body\" data-bs-toggle=\"popover\" data-bs-placement=\"top\" data-bs-content=\"Đã thêm vào buysell.txt\">+</button>"}
		</span>
		
        <span class="colID" title='${item.index} (${item.code})'>
            ${item.index}
        </span>
        <span class="colName"> 
            ` +
            (item.isFirstRow ? name : 
            `
            <span class="colEdit">
                <select class="searchItem" forID='${item.index}'>
                    <option value="${item.code}">${name}</option>                
                </select>
            </span>
            `)+ `
        </span>
		

    `;

    if (item.shopCounter){
        html += `

        <span class="colShopCounter" title='${item.isFirstRow ? "" : item.shopCounter.join(",")}'>
            ${item.isFirstRow ? "SD" : item.shopCounter.length}
        </span>
        `;
    }
	
	html += `

        <span class="colShopCounter" title='${item.isFirstRow ? "Ngũ Hành" : item.kind}'>
            ${item.isFirstRow ? "NH" : item.data[3]}
        </span>
		
        <span class="colShopCounter" title='${item.isFirstRow ? "Cấp" : item.level}'>
            ${item.isFirstRow ? "Cấp" : item.data[4]}
        </span>
        `;

    // Other columns = data
    $.each(goodsColumnRename, (key, value) => {
        html += `                
        <span class="colData ${item.isFirstRow ? "" :""}" forColumn="${key}">
        ${item.isFirstRow ? goodsColumnRename[key] : `
            <span class="colDisplay">${item.isFirstRow ? goodsColumnRename[key] : item.data[key]}</span>
            <input class="colEdit" type="number" value="${item.data[key]}"/>
            `}
        </span>`;
    });

    html += `<span class="controllerTool">
        ${item.isFirstRow ? "" : "<button class='btn btn-secondary btn-sm cancelEditGood'>Phục Hồi</button> <button class='btn btn-danger btn-sm deleteGood'>Xóa</button>"}
    </span>`;

    html += "</li>";
    return html;
};

let changedRows = {};

const onReplaceItem = (fromID, toID) => {

    if (typeof changedRows[fromID] === "undefined"){
        changedRows[fromID] = JSON.parse(JSON.stringify(CACHE.data.goodsData[fromID]));
    }

    let newItem = CACHE.data.allItems[toID];
    CACHE.data.goodsData[fromID][26] = newItem.name;
    CACHE.data.goodsData[fromID][0] = newItem.genre;
    CACHE.data.goodsData[fromID][1] = newItem.type;
    CACHE.data.goodsData[fromID][2] = newItem.spec;
	CACHE.data.goodsData[fromID][3] = newItem.kind;
    CACHE.data.goodsData[fromID][4] = newItem.level;

    thisLib.show();
    llEvents.trigger("buysellData.changed");
};

const itemsPerPage = 100;
let boundEvent = false,
    bindEvents = (container) => {
        if (boundEvent) return;
        boundEvent = true;


        // Navigation by page?
        $("#goodsEditorPagination").on("click", ".page-link", function(e){
            e.preventDefault();
            e.stopPropagation();
            thisLib.show(container, $(this).attr("forPage"));
        });

        let onKeyUp = _.debounce(function(){
            thisLib.show(false, 1);
        },1000);

        $("#filterGoodByName").keyup(onKeyUp);


        // Controller: nothing
        container.on("click", ".controllerTool .cancelEditGood", function(e){
            e.preventDefault();
            e.stopPropagation();

            let rowID = $(this).closest(".dataRow").attr("forID");
            CACHE.data.goodsData[rowID] = JSON.parse(JSON.stringify(changedRows[rowID]));
            delete changedRows[rowID];
            thisLib.show();
        });

        // Action: delete good
        container.on("click", ".controllerTool .deleteGood", function(e){
            e.preventDefault();
            e.stopPropagation();

            let ID = $(this).closest(".dataRow").attr("forID");
            

            // Update goods
            CACHE.data.goodsData.splice(ID, 1);

            // Update buysells
            CACHE.data.buysellData.forEach((shopD, index) => {
                if (index == 0) return true;
                if (shopD.length <= 1) return true;

                // Lower down by one
                let changed = false;

                // Remove the removed item
                shopD = shopD.filter((v, k)=>{
                    if (k > 0 && v === ID){
                        changed = true;
                        return false;
                    }
                    return true;
                });

                // Decrease the bigger
                shopD.forEach((item, itemIndex) => {
                    if (itemIndex > 0 && item > ID){
                        shopD[itemIndex] = item - 1;
                        changed=true;
                    }
                });

                if (changed){
                    CACHE.data.buysellData[index] = shopD;
                } 
            }); 

            // Reload current page
            thisLib.show(container, currentPage);
            buysel_editor.show();

        }); 


        // Action add good
        let addNewGoodToShopInp = $("#addNewItemToGoodInp");    
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
                        enteredKW = ll.helpers.u2t(enteredKW).toLowerCase();
                        
                        $.each(CACHE.data.allItemsKey, function(k,code){
                            let v = CACHE.data.allItems[code];
                            let t = CACHE.getSearchToken(code, v);
                            if (t.indexOf(enteredKW) !== -1){
                                output.push({
                                    text: ll.helpers.t2u(v.name) + " ("+code.replace(/_/g," ")+" "+v.__type+")",
                                    id: code,
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
            
            let lastRow = Array(CACHE.data.goodsData[CACHE.data.goodsData.length-1].length).fill("");
            let newItem = JSON.parse(JSON.stringify(CACHE.data.allItems[selectedData.id]));

            lastRow[26] = newItem.name;            
            lastRow[0] = newItem.genre;
            lastRow[1] = newItem.type;
            lastRow[2] = newItem.spec;
			lastRow[3] = newItem.kind;
            lastRow[4] = newItem.level;
 
            
            CACHE.data.goodsData.push(lastRow);
            
            thisLib.show();
            llEvents.trigger("buysellData.changed");

        });

        // Action: edit good
        container.on("blur", ".colEdit[type='number']", function(e){
            let col = parseInt($(this).closest(".colData").attr("forColumn"), 10);
            let value = parseInt($(this).val(), 10);
            let itemID = parseInt($(this).closest(".dataRow").attr("forID"), 10);

            CACHE.data.goodsData[itemID][col] = value;
        });

		llEvents.on("goodsData.changed", _.debounce(()=>{
			thisLib.show();
		}, 1000));

        $("#buysellSelection").change(function(){
            // Get the selected value
            let selectedValue = $(this).val();

            // Find the selected option element
            let selectedOption = $(this).find('option[value="' + selectedValue + '"]');
            $(".add2BuySell").attr("data-bs-content", "Đã thêm vào "+selectedOption.text());
            $(".add2BuySell").closest(".colChose").attr("title", "Thêm vào "+selectedOption.text());
        });

		// Action: add to shop
		container.on("click", ".add2BuySell", function(){
            let row = $(this).closest(".dataRow");
			let itemID = parseInt(row.attr("forID"), 10);
			let selectedShop = $("#buysellSelection").val();
			if (CACHE.data.buysellData[selectedShop]){
				let found = false;
				$.each(CACHE.data.buysellData[selectedShop], (k,v)=>{
					if (k>0 && (v == '' || !v)){
						CACHE.data.buysellData[selectedShop][k]= itemID;
						found = true;
						return false;
					}
				});
				if (!found){
					CACHE.data.buysellData[selectedShop].push(itemID);
				}
			}
            row.addClass("flash-row");
            /*setTimeout(()=>{
                row.removeClass("flash-row");
            }, 5000)*/
			llEvents.trigger("buysellData.changed");
		});
    };

let container, currentPage;

const thisLib = {

    show: (c, p)=>{

        if (c) container = c;
        if (p) currentPage = p;

        bindEvents(container); 
        if (!CACHE.data.goodsData) return;
        let items = JSON.parse(JSON.stringify(CACHE.data.goodsData)),
            total = CACHE.data.goodsData.length;
        const firstRow = items.shift();

        items.reverse();
 
        let newItems = [];
        items.forEach((v, k) => {  
            let position = total-k-1;
            let item = getInfoOfItemFromGoodsData(position, v);

            CACHE.data.goodsData[position][26] = item.name;
            newItems.push(item);
        });

        
        let enteredKW = $("#filterGoodByName").val();
        
        let filteredData = [];
        if (enteredKW !== ""){
            enteredKW = ll.helpers.u2t(enteredKW); 
            $.each(newItems, function(k,data){
                if (data.name && data.name.toLowerCase().indexOf(enteredKW.toLowerCase()) !== -1){
                    filteredData.push(data);
                }
            }); 
            newItems = filteredData;
        }

        container.empty();
        
        if (!newItems || newItems.length === 0) return true; 

        const totalPages = Math.ceil(newItems.length / itemsPerPage);

        if (!currentPage) currentPage = 1;

        // Pagination
        let paginationContainer = $("#goodsEditorPagination"),
            pageination = $(`<ul class="pagination"></ul>`);
 
        
        for (let i = 1; i <= totalPages; i++) {
            pageination.append('<li class="page-item '+(i == currentPage ? "active" :"")+'" ><a class="page-link" href="#" forPage="'+i+'">'+(totalPages-i+1)+'</a></li>');
        }
        paginationContainer.empty().append(pageination);
 
        // Content 
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, newItems.length);
        const itemsToDisplay = newItems.slice(startIndex, endIndex);
       
        let html = "<ul id='goodsTable' class='baseTableShop'>";
        html += genRowHtml({
            name: "Tên",
            index: "ID",
            data: firstRow,
            isFirstRow: true,
            id: "ID",
            shopCounter: []
        }); 
        
        itemsToDisplay.forEach((item, k) => { 
            let displayData = JSON.parse(JSON.stringify(item));

            displayData.shopCounter = [];
            
            $.each(CACHE.data.buysellData, function(shopIndex, shopInfo){
                if (shopInfo.indexOf(item.index) > 0){
                    displayData.shopCounter.push(shopIndex);
                }
            });
            html +=  genRowHtml(displayData); 
        });
        
        html += "</ul>";
        container.html(html);

        container.find(".searchItem").select2($.extend({}, window.llGlobal,{ 
            ajax: {
                delay: 50,
                cache: true,
                url: function (params) {
                  return '';
                },
                processResults: function (data, params) {
                    

                    let enteredKW = params.term;
        
                    let output = [];

                    if (enteredKW !== ""){
                        $.each(CACHE.data.allItemsKey, function(k,code){
                            let v = CACHE.data.allItems[code];
                            let t = code.replace(/_/g," ")+v.name+v.spr;
                            if (t.toLowerCase().indexOf(enteredKW.toLowerCase()) !== -1){
                                output.push({
                                    text: v.name + " ("+code.replace(/_/g," ")+" "+v.__type+")",
                                    id: code,
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