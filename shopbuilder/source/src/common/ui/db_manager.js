import ll from "../../libs";
import CACHE from "../cache";

let container;


const bindEvents = () =>{

    // Restore magic script btn OK/CANCEL
    container.on("click", "#cancelCachedMagicScript", function(e){
        ll.db.remove("magicscript.txt");
        $(".foundMagicscriptTxt").removeClass('isVisible');
    });
    container.on("click", "#useCachedMagicScript", function(e){
        ll.db.get("magicscript.txt").then(function(d){
            if (d){
                CACHE.data.magicscript = d;
                llEvents.trigger("magicscript.changed"); 
                $(".foundMagicscriptTxt").removeClass('isVisible');
            }
        });
    });

    // Restore buyselld goods
    container.on("click", "#cancelCachedGoods", function(e){
        ll.db.remove("goods.txt");
        ll.db.remove("buysell.txt");
        $(".foundGoodsTxt").removeClass('isVisible');
    });
    container.on("click", "#useCachedGoods", function(e){
        let onDone = _.debounce(()=>{
            llEvents.trigger("goodsData.changed");
            llEvents.trigger("buysellData.changed");

        }, 1000);
        ll.db.get("goods.txt").then(function(d){
            if (d){
                CACHE.data.goodsData = d;
                onDone();
            }
        });
        ll.db.get("buysell.txt").then(function(d){
            if (d){
                CACHE.data.buysellData = d;
                console.log(d);
                onDone();
            }
        });
        $(".foundGoodsTxt").removeClass('isVisible');
    });
}

let inited = false;
const thisLib = {
    init: () =>{
        if (inited) return;
        inited = true;
        container = $(".cacheManager");

        bindEvents();
 
        /*
            Show/hide restore magicscript.txt
        */
        ll.db.get("magicscript.txt").then(function(d){
            if (d){

                container.append(`

                <div class="cacheFoundContainer foundMagicscriptTxt isVisible alert alert-warning" role="alert">
                    <p>Tìm thấy file <b>magicscript.txt</b> đã chỉnh sửa trước đó trong bộ nhớ. Sử dụng:</p>

                    <p>
                        <button class="btn btn-outline-primary btn-sm" type="button" id="cancelCachedMagicScript">magicscript.txt của file zip (mặc định)</button> 
                        <button class="btn btn-outline-primary btn-sm" type="button" id="useCachedMagicScript">magicscript.txt của bộ nhớ</button>
                    </p>
                </div>
                `);
 
            }
        });

        /*
            Show/hide restore buysell.txt & goods.txt
        */
        ll.db.get("goods.txt").then(function(d){
            if (d){

                container.append(`

                <div class="cacheFoundContainer foundGoodsTxt isVisible alert alert-warning" role="alert">
                    <p>Tìm thấy file <b>buysell.txt</b> <b>goods.txt</b> đã chỉnh sửa trước đó trong bộ nhớ. Sử dụng:</p>

                    <p>
                        <button class="btn btn-outline-primary btn-sm" type="button" id="cancelCachedGoods">buysell.txt goods.txt của file zip (mặc định)</button> 
                        <button class="btn btn-outline-primary btn-sm" type="button" id="useCachedGoods">buysell.txt goods.txt của bộ nhớ</button>
                    </p>
                </div>
                `);
    
            }
        });

        /*
            Auto save moi 30 giay
        */
        setInterval(()=>{
            ll.db.save("goods.txt", CACHE.data.goodsData);
            ll.db.save("buysell.txt", CACHE.data.buysellData); 
            ll.db.save("magicscript.txt", CACHE.data.magicscript);
        }, 30*1000);
    }



};



export default thisLib;