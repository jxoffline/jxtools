import CACHE from "../cache"; 
import ll from "../../libs";

let currentPage = 1, itemsPerPage = 100, container, currentFilter = "all";

export const typeTranslation = {
        "horse": "Ngựa",
        "mask": "Mặt nạ",
        "questkey": "Vật phẩm NV",
        "boot":  "Giày",
        "armor": "Áo",
        "amulet": "Dây chuyền",
        "ring": "Nhẫn",
        "rangeweapon": "VK tầm xa",
        "meleeweapon": "VK cận chiến",
        "helm": "Nón",
        "belt": "Thắt lưng",
        "potion": "Thuốc",
        "cuff": "Bao tay",
        "pendant": "Ngọc bội",
        "magicscript": "Vật phẩm",
        "huangjintupu": "Đồ phổ",
        "goldequip": "Đồ HK",
        "platinaequip": "Đồ BK",
    };

const doTypeTranslation = (inp) => {
        return typeTranslation[inp] ? (typeTranslation[inp] + " - "+inp+" ") : inp;
    },
    genFilterDropdown = (currentFilter) => {
        // Create an array to store the options
        const optionsArray = [];

        // Iterate through your data and push options into the array
        $.each(CACHE.data.allItemKeysByType, function(k, v) {
            if (v.length > 0) {
                optionsArray.push({
                label: doTypeTranslation(k) + ` (${v.length})`,
                value: k,
                });
            }
        });

        // Sort the options alphabetically based on the label property
        optionsArray.sort((a, b) => a.label.localeCompare(b.label));

        // Create the <select> element
        const filter = $('#itemFilterSelect');
        filter.html('<option value="all" '+`${'all' === currentFilter ? "selected" : ""}`+'>Tất cả</option>');

        // Append the sorted options to the <select> element
        optionsArray.forEach(option => {
            filter.append(`<option value='${option.value}' ${option.value === currentFilter ? "selected" : ""}>${option.label}</option>`);
        });

        // Append the <select> element to your desired container
        return filter;
    };
    
const genRowHtml = (item) => {
    let html = "<li class='dataRow isEditing' forID='"+item.code+"'>"; 
    let type = doTypeTranslation(item.__type);
    let code = item.isFirstRow ? item.code : [item.genre, item.type, item.spec].join(" ")

    let name = item.isFirstRow ? item.name : ll.helpers.t2u(item.name);

    // First column = name
    html += `
 

		<span class="colChose" title="Thêm vào danh sách vật phẩm bán (goods.txt)">
			${item.isFirstRow ? "" : "<button class='btn btn-primary btn-sm add2Goods' data-bs-container=\"body\" data-bs-toggle=\"popover\" data-bs-placement=\"top\" data-bs-content=\"Đã thêm vào ds vật phẩm bán (goods.txt)\">+</button>"}
		</span>
        <span class="colID colData" forValue='${code}'>
            ${code} 
            ${item.kind}
        </span>
        <span class="colLevel colData" title='${item.level}'>
            ${item.level}
        </span>
        <span class="colType" title='${type}'> 
            <span class="colDisplay">${type} ${item.isFirstRow ? "" : item.__source}</span>
            <span class="colEdit">${type} ${item.isFirstRow ? "" : item.__source} </span>
        </span>
        <span class="colName" title='${item.code}'> 
            <span class="colDisplay">${name}</span>
            <span class="colEdit">${name} </span>
        </span>

        <span class="colSpr" title='${item.spr}'> 
            <span class="colDisplay">${item.spr}</span>
            <span class="colEdit">${item.spr} </span>
        </span>

        <span class="colScript" title='${type !== "magicscript" ? "" : item.script}'> 
            <span class="colDisplay">${type !== "magicscript" ? "" : item.script}</span>
            <span class="colEdit">${type !== "magicscript" ? "" : item.script} </span>
        </span>
		
    `; 

    html += "</li>";
    return html;
};

// Helpers: bind events
let boundEvent = false;
const bindEvents = () => { 
    if (boundEvent) return; 
    boundEvent = true;  

    // Navigation by page?
    $("#itemViewerPagination").on("click", ".page-link", function(e){
        e.preventDefault();
        e.stopPropagation();
        thisLib.show(false, $(this).attr("forPage"));
    });

    $("#itemFilterSelect").on("change", function(e){
        currentFilter = $(this).val();
        currentPage = 1;
        thisLib.show();
    });

    let onKeyUp = _.debounce(function(){
        thisLib.show();
    }, 1000);
    $("#item-viewers-tab-pane").on("keyup", "#filterByName", onKeyUp);

    container.on("click", ".add2Goods", function(){
        let row = $(this).closest(".dataRow");

        
		let code = row.attr("forID");
		
		
        let lastRow = Array(CACHE.data.goodsData[CACHE.data.goodsData.length-1].length).fill("");
		let newItem = JSON.parse(JSON.stringify(CACHE.data.allItems[code]));

		lastRow[26] = newItem.name;            
		lastRow[0] = newItem.genre;
		lastRow[1] = newItem.type;
		lastRow[2] = newItem.spec;
		lastRow[3] = newItem.kind;
		lastRow[4] = newItem.level;

		
        row.addClass("flash-row");
        /*setTimeout(()=>{
            row.removeClass("flash-row");
        }, 5000)*/

		CACHE.data.goodsData.push(lastRow);
		llEvents.trigger("goods.changed");
		//goods_editor.show();
		
    });

}


let thisLib = {
    
    show: (c, p) => {
        if (c) container = c;
        if (p) currentPage = p;
        
        bindEvents();

        let items = currentFilter && currentFilter !== "all" ? CACHE.data.allItemKeysByType[currentFilter] : CACHE.data.allItemsKey;

        let enteredKW = ll.helpers.u2t($("#filterByName").val());
        
        if (enteredKW !== ""){
            let output = [];
            enteredKW = enteredKW.toLowerCase();
            $.each(items, function(k,code){
                let v = CACHE.data.allItems[code];
                let t = CACHE.getSearchToken(code, v);
                if (t.indexOf(enteredKW) !== -1){
                    output.push(code);
                }
            }); 
            items = output; 
        }
         
        if (!items) return true;

        
        // Func1: filter
        genFilterDropdown(currentFilter);

        // Func2: pagination
        const totalPages = Math.ceil(items.length / itemsPerPage);
        if (currentPage > totalPages) currentPage = totalPages;
        let paginationContainer = $("#itemViewerPagination"),
            pageination = $(`<ul class="pagination"></ul>`);
        for (let i = 1; i <= totalPages; i++) {
            pageination.append('<li class="page-item '+(i == currentPage ? "active" :"")+'" ><a class="page-link" href="#" forPage="'+i+'">'+i+'</a></li>');
        }
        paginationContainer.empty().append(pageination);

        // Func3: content
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, items.length);
        const itemsToDisplay = items.slice(startIndex, endIndex);
    
        let html = "<ul id='itemsTable' class='baseTableShop'>";
        html += genRowHtml({
            name: "Tên",
            index: "ID",
            //data: firstRow,
            isFirstRow: true,
            code: "ID",
            __type: "Loại",
            level: "Cấp",
            spr: "Hình",
            script: "Script",
			kind: "NH"
        });   
        itemsToDisplay.forEach((v, k) => {
            let item = CACHE.data.allItems[v];
            html +=  genRowHtml(item); 
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