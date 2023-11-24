import './index.scss';
let pEncrypt = require("./pEncrypt");

const showStatus = (inp, type) =>{

    let s = $("#statusTxt");
    s.text(inp);
    s.removeClass("alertTxt");
    if (type === "error"){
        s.addClass("alertTxt");
    }
};

$(document).ready(()=>{
    
    $("#doEncrypt").click(()=>{
        showStatus("");
        const $input = $("#inputText");
        const $output = $("#outputText");

        const inpVal = $input.val();
        if (!inpVal || inpVal.length > 20 || inpVal.length === 0){
            return showStatus("Mật khẩu không hợp lệ. Phải ít hơn 20 ký tự.", "error");
        }
        $output.val(pEncrypt.encrypt(inpVal));

    });


    $("#doDecrypt").click(()=>{
        showStatus("");
        const $output = $("#inputText");
        const $input = $("#outputText");

        const inpVal = $input.val();
        if (!inpVal || inpVal.length != 32){
            return showStatus("Mã hóa không hợp lệ. Phải 32 ký tự.", "error");        }
        $output.val(pEncrypt.decrypt(inpVal));

    });
});
  