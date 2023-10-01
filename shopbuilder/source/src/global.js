import eventsLib from "./common/events.js";

const select2Config = {
    minimumInputLength: 1,
    width: "100%",
    placeholder: {
        id: "",
        placeholder: "Tìm"
    },
    language: {
        inputTooShort: function () {
            return "Gõ ít nhất 1 chữ";
        }
    }
};


$(document).on('select2:open', () => {
    document.querySelector('.select2-search__field').focus();
});
window.llGlobal = select2Config;
window.llEvents = eventsLib;