import CACHE from "../cache"; 
import ll from "../../libs";

let currentPage = 1, itemsPerPage = 100, container;
 
const firstRowData = [
    "",   
    "Tên vật phẩm",
    "Genre",
    "Type",
    "Spec",
    "Hình",
    "Tác dụng trong hành trang",
    "Chiều ngang hình",
    "Chiều dọc hình",
    "Mô tả",
    "HDSD",
    "Giá bán vào shop",
    "?",
    "SL nhỏ trong hành trang",
    "LUA script",
    "Hiệu ứng",
    "Có thể vứt",
    "Thông báo",
    "?",
    "Có thể bỏ vào phím tắt",
    "?",
    "SL Xếp chồng",
    "Level nv sử dụng"

];    
 

const getCodeFromRow = (row) => {
    return [row[1], row[2], row[3] || 0, row[9] || 0, row[11] || 0].join("_");
};

const genRowHtml = (row, index) => { 
 
    let realIndex = row.shift();
    
    let code = getCodeFromRow(row);


    
    let html = `<li class='dataRow isEditing ${index === -1 ? "firstRow": ""}' forID='${realIndex}' forCode='${code}'>`; 
    

    
    // First column: xóa
    html += ` 
        <span class="colChose" title="Thêm vào danh sách vật phẩm bán (goods.txt)">
            ${index === -1 ? "" : "<button class='btn btn-primary btn-sm add2Goods' data-bs-container=\"body\" data-bs-toggle=\"popover\" data-bs-placement=\"top\" data-bs-content=\"Đã thêm vào ds vật phẩm bán (goods.txt)\">+</button>"}
        </span>
        <span class="rowData" title="${code}">${realIndex}</span>
    `;

    
    $.each(row, (k,v)=>{ 
        if (k > 21) return false;

        // Row title
        if (index === -1){
            let keyChar = String.fromCharCode(65 + k) || "";
            html += `<span class="rowData" forCol="${k}" title="${firstRowData[k]}">
                
                ${v}<br/>
                <b>${keyChar}</b>
            </span>`;

        }
        // Row data
        else{

            // Lock column
            if ([1].indexOf(k) !== -1){

                html += `
                <span class="rowData ${[0,4,8,13].indexOf(k) !== -1 ? "isText": "isNumber"}" forCol="${k}">
                    ${v}
                </span>`;
                return true;
            }

            // Escapte text column
            if ([0,4,8].indexOf(k) !== -1){
                v = he.escape(ll.helpers.t2u(v));
            }

            // Inline edit?
            html += `
            <span class="rowData ${[0,4,8,13].indexOf(k) !== -1 ? "isText": "isNumber"}" forCol="${k}" title="${firstRowData[k]}">
                <input class="form-control" type="text" forCol="${k}" value="${v}"/>
            </span>`;
        }
    }); 



    
    // First column: xóa
    html += `<span class="controllerTool">
        ${index === -1 ? "" : "<button class='btn btn-secondary btn-sm cancelEditGood'>Phục Hồi</button> <button class='btn btn-danger btn-sm deleteMSItem'>Xóa</button>"}
    </span>`;

    html += "</li>";
    return html;
};

// Helpers: bind events
let boundEvent = false;
const bindEvents = () => { 
    if (boundEvent) return; 
    boundEvent = true;  

    // Navigation by page?
    $("#magicscriptEditorPagination").on("click", ".page-link", function(e){
        e.preventDefault();
        e.stopPropagation();
        thisLib.show(false, $(this).attr("forPage"));
    });
  
    // Action: filtering
    let onKeyUp = _.debounce(function(){
        thisLib.show(false, 1);
    }, 1000);
    $("#magicscript-tab-pane").on("keyup", "#filterMagicscriptByName", onKeyUp);

    // Action: add 2 goods.txt - completed
    container.on("click", ".add2Goods", function(){
        let row = $(this).closest(".dataRow");
		let code = row.attr("forCode");
				 

        let lastRow = Array(CACHE.data.goodsData[CACHE.data.goodsData.length-1].length).fill("");
		let newItem = JSON.parse(JSON.stringify(CACHE.data.allItems[code]));

		lastRow[26] = newItem.name;            
		lastRow[0] = newItem.genre;
		lastRow[1] = newItem.type;
		lastRow[2] = newItem.spec;
		lastRow[3] = newItem.kind;
		lastRow[4] = newItem.level;

		
        row.addClass("flash-row"); 

		CACHE.data.goodsData.push(lastRow);
		llEvents.trigger("goods.changed"); 
		
    });

    // Action: delete magicscript - completed
    container.on("click", ".controllerTool .deleteMSItem", function(e){
        e.preventDefault();
        e.stopPropagation();

        let ID = $(this).closest(".dataRow").attr("forID"); 
        let code = $(this).closest(".dataRow").attr("forCode"); 

        delete CACHE.searchCache[code];
        
        // Update magicscript
        CACHE.data.magicscript.splice(ID, 1);
        
        // Remove from all items
        delete CACHE.data.allItems[code];
        CACHE.data.allItemKeysByType.magicscript = CACHE.data.allItemKeysByType.magicscript.filter(v => v !== code);
        CACHE.data.allItemsKey = CACHE.data.allItemsKey.filter(v => v !== code);
        
        // Reload current page
        thisLib.show(container, currentPage);
    }); 

    // Action: add magicscript
    $("#addNewMSItem").click(function(e){
        e.preventDefault();
        e.stopPropagation();

        // Clone the last row
        let clone = JSON.parse(JSON.stringify(CACHE.data.magicscript[CACHE.data.magicscript.length-1].slice()));

        // Keep the same except 0,4,5,8,13
        clone[0] = "";
        clone[3] = clone[3] ? (clone[3] + 1) : 0;   // should be max() of the list but cant be bothered
        clone[4] = "";
        clone[5] = "";
        clone[8] = "";
        clone[13] = "";

        // Add 2 magicscript.txt and the cache pool
        CACHE.data.magicscript.push(clone);
        CACHE.addItemToCachePool("magicscript", clone);
        CACHE.onCachePoolReady();

        // Reshow data for testing purpose
        thisLib.show();

    });

    // Action: edit MS item    
    container.on("blur", ".rowData input", function(e){
        let col = parseInt($(this).closest(".rowData").attr("forCol"), 10);
        let value = $(this).val();

        let intValue = parseInt(value, 10); // The second argument (10) specifies the base (radix) for parsing, which is 10 for decimal numbers

        if (!isNaN(intValue)) {
            value = intValue;
        }else{

            // String UTF-8 to TCVN3
            if ([0,4,8].indexOf(col) !== -1){
                value = ll.helpers.u2t(value);
            }
        }

        let itemID = parseInt($(this).closest(".dataRow").attr("forID"), 10);

        
        let oldCode = getCodeFromRow(CACHE.data.magicscript[itemID]);        

        // Edit value in magicscript.txt
        CACHE.data.magicscript[itemID][col] = value;

        // Delete old code
        delete CACHE.data.allItems[oldCode];
        delete CACHE.searchCache[oldCode];

        CACHE.data.allItemKeysByType.magicscript = CACHE.data.allItemKeysByType.magicscript.filter(v => v !== oldCode);
        CACHE.data.allItemsKey = CACHE.data.allItemsKey.filter(v => v !== oldCode);

        // Edit cache pool
        CACHE.addItemToCachePool("magicscript", CACHE.data.magicscript[itemID]);
        CACHE.onCachePoolReady();
    });
}


let thisLib = {
    
    show: (c, p) => {
        if (c) container = c;
        if (p) currentPage = p;
        
        bindEvents();

        let items = JSON.parse(JSON.stringify(CACHE.data.magicscript));
        items = items.map((v,k)=>{
            v.unshift(k);
            return v;
        });

        items.shift();
        items.reverse();
        let enteredKW = ll.helpers.u2t($("#filterMagicscriptByName").val());
        
        if (enteredKW !== ""){
            enteredKW = enteredKW.toLowerCase();
            items = items.filter((row)=>{
                let code = [row[2], row[3], row[4] || 0, row[10] || 0, row[12] || 0].join("_");
                return CACHE.getSearchToken(code, CACHE.data.allItems[code]).indexOf(enteredKW) !== -1;
            }); 
        }
         
        container.empty();


        if (!items) return true;
 
         
        // Func2: pagination
        const totalSize = items.length;
        const totalPages = Math.ceil(totalSize / itemsPerPage);
        if (currentPage > totalPages) currentPage = totalPages;
        let paginationContainer = $("#magicscriptEditorPagination"),
            pageination = $(`<ul class="pagination"></ul>`);
        for (let i = 1; i <= totalPages; i++) {
            pageination.append('<li class="page-item '+(i == currentPage ? "active" :"")+'" ><a class="page-link" href="#" forPage="'+i+'">'+(totalPages-i+1)+'</a></li>');
        }
        paginationContainer.empty().append(pageination);

        console.log("G", pageination);
        // Func3: content
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, items.length);
        const itemsToDisplay = items.slice(startIndex, endIndex);
    
        let html = "<ul id='magicscriptTable' class='baseTableShop'>";
        html += genRowHtml(JSON.parse(JSON.stringify(firstRowData)), -1);
        itemsToDisplay.forEach((v, k) => {  
            html +=  genRowHtml(v, k); 
        });
        html += "</ul>";

        container.empty().append($(html)); 
 
        
        // Enable popovers
        const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
        popoverTriggerList.forEach(popoverTriggerEl => {
            if (!popoverTriggerEl.hasAttribute('data-bs-popover-initialized')) {
                popoverTriggerEl.setAttribute('data-bs-popover-initialized', 'true');

                const popover = new bootstrap.Popover(popoverTriggerEl);

                // Add an event listener to the popover element
                popoverTriggerEl.addEventListener('shown.bs.popover', function () {
                    const popoverInstance = bootstrap.Popover.getInstance(popoverTriggerEl);

                    // Auto-hide the popover after 3 seconds (3000 milliseconds)
                    setTimeout(function () {
                    popoverInstance.hide();
                    }, 2000);
                });
            }
        });
    }
};



export default thisLib;