(()=>{var r={41:r=>{var t=20,e=32,n=e-t-2,o=e-2,a=151,c=7,u=32,s=126,f=s-u+1;function d(r){return r>="a"&&r<="z"||r>="A"&&r<="Z"||"_"===r||r>="0"&&r<="9"}function p(r){return!d(r)}function l(r){var t=r.charCodeAt(0);return 31&((t^=a)<<c|t>>>8-c)}function v(r){var t,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;if(r<0||r>e-2)throw new Error("Invalid input");for(var o=n%f,a=o+f;o<a;o++)if(l(t=String.fromCharCode(o%f+u))===r&&d(t))return t;for(var i=n%f,c=i+f;i<c;i++)if(l(t=String.fromCharCode(i%f+u))===r)return t;throw new Error("Invalid input")}function h(r){var t;function e(e,n){t=r[e],r[e]=r[n],r[n]=t}e(0,13),e(31,25),e(12,30),e(7,19),e(3,21),e(9,20),e(15,18)}function m(r,a){var i;if(a.length!==e)return 0;for(var c=new Array(e+1),s=0;s<e;s++)c[s]=a[s];if(c[e]="\0",h(c),(i=l(c[0]))<n||i>o)return 0;var d=l(c[i+1]);return d<0||d>t?0:(function(r,t,e,n,o){for(var a=0;a<o;a++){var i=r[a%t],c=n[a];e[a]=String.fromCharCode((f+(c.charCodeAt(0)-u)-(i.charCodeAt(0)-u))%f+u)}e[o]="\0"}(c.slice(1),i,r,c.slice(i+2),d),1)}function g(r,o,a,i){if(++i>32)return 0;var c,d=[1153,1789,2797,3023,3491,3617,4519,4547,5261,5939,6449,7307,8053,9221,9719,9851,313,659,1229,1847,2459,3121,3793,4483,5179,6121,6833,7333,7829,8353,9323,9829],l=o.length,y=0;if(l>t)return 0;for(var x=0;x<l;x++)if(o[x].charCodeAt(0)<u||o[x].charCodeAt(0)>s)return 0;(y=e-l-2)>n&&(y=(a+10237)%(y-n)+n),r[0]=v(y,a);for(var A=[],w=0;w<y;w++){var b=a+d[w],T=String.fromCharCode(b%f+u);p(T)&&(T=String.fromCharCode(1&b?"a".charCodeAt(0)+b%26:"A".charCodeAt(0)+b%26)),A.push(T)}var S=new Array(l);c=function(r,t,e,n,o){for(var a=0;a<o;a++){var i=r[a%t],c=n[a];if(p(c=String.fromCharCode((c.charCodeAt(0)-u+(i.charCodeAt(0)-u))%f+u))){var d=0;do{if((c=c.charCodeAt(0)+1)>s&&(c=u),(i=i.charCodeAt(0)+1)>s&&(i=u),c=String.fromCharCode(c),i=String.fromCharCode(i),r[a%t]=i,d++>255)return 0}while(p(i)||p(c))}e[a]=c}return 1}(A,y,S,o,l);for(var M=0;M<A.length;M++)r[M+1]=A[M];r[y+1]=v(l,a);for(var k=0;k<S.length;k++)r[y+2+k]=S[k];for(var E=0;E<e-2-y-l;E++){var $=a+d[e-E-1],I=String.fromCharCode($%f+u);p(I)&&(I=String.fromCharCode(1&$?"a".charCodeAt(0)+$%26:"A".charCodeAt(0)+$%26)),r[e-E-1]=I}h(r);var P=new Array(e),Z=r.slice();Z.pop(),o.slice().pop(),r[e]="\0";var j=0;return c&&(j=m(P,Z),P=C(P)),c&&j&&P===o.join("")?1:g(r,o,a+9929,i)}function C(r){var t="",e=r.length;for(e>32&&(e=32),i=0;i<e&&"\0"!==r[i];i++)t+=r[i]||"";return t}r.exports={encrypt:function(r){var t=new Array(32);return g(t,r.split(""),Date.now(),0),C(t)},decrypt:function(r){var t=new Array(20);return m(t,r.split("")),C(t)}}},800:(r,t,e)=>{"use strict";e.d(t,{Z:()=>c});var n=e(81),o=e.n(n),a=e(645),i=e.n(a)()(o());i.push([r.id,".pageMain{padding:20px;display:block;width:900px;margin:auto}.actionBtns{text-align:center;max-width:150px}.controllerContainer{padding:60px 40px}.controllerContainer input[type=text]{width:300px}footer{font-weight:normal;color:#bbb}.alertTxt{color:red}#statusTxt{margin-top:20px}.md5{font-size:12px;margin-top:10px}\n",""]);const c=i},645:r=>{"use strict";r.exports=function(r){var t=[];return t.toString=function(){return this.map((function(t){var e="",n=void 0!==t[5];return t[4]&&(e+="@supports (".concat(t[4],") {")),t[2]&&(e+="@media ".concat(t[2]," {")),n&&(e+="@layer".concat(t[5].length>0?" ".concat(t[5]):""," {")),e+=r(t),n&&(e+="}"),t[2]&&(e+="}"),t[4]&&(e+="}"),e})).join("")},t.i=function(r,e,n,o,a){"string"==typeof r&&(r=[[null,r,void 0]]);var i={};if(n)for(var c=0;c<this.length;c++){var u=this[c][0];null!=u&&(i[u]=!0)}for(var s=0;s<r.length;s++){var f=[].concat(r[s]);n&&i[f[0]]||(void 0!==a&&(void 0===f[5]||(f[1]="@layer".concat(f[5].length>0?" ".concat(f[5]):""," {").concat(f[1],"}")),f[5]=a),e&&(f[2]?(f[1]="@media ".concat(f[2]," {").concat(f[1],"}"),f[2]=e):f[2]=e),o&&(f[4]?(f[1]="@supports (".concat(f[4],") {").concat(f[1],"}"),f[4]=o):f[4]="".concat(o)),t.push(f))}},t}},81:r=>{"use strict";r.exports=function(r){return r[1]}},379:r=>{"use strict";var t=[];function e(r){for(var e=-1,n=0;n<t.length;n++)if(t[n].identifier===r){e=n;break}return e}function n(r,n){for(var a={},i=[],c=0;c<r.length;c++){var u=r[c],s=n.base?u[0]+n.base:u[0],f=a[s]||0,d="".concat(s," ").concat(f);a[s]=f+1;var p=e(d),l={css:u[1],media:u[2],sourceMap:u[3],supports:u[4],layer:u[5]};if(-1!==p)t[p].references++,t[p].updater(l);else{var v=o(l,n);n.byIndex=c,t.splice(c,0,{identifier:d,updater:v,references:1})}i.push(d)}return i}function o(r,t){var e=t.domAPI(t);return e.update(r),function(t){if(t){if(t.css===r.css&&t.media===r.media&&t.sourceMap===r.sourceMap&&t.supports===r.supports&&t.layer===r.layer)return;e.update(r=t)}else e.remove()}}r.exports=function(r,o){var a=n(r=r||[],o=o||{});return function(r){r=r||[];for(var i=0;i<a.length;i++){var c=e(a[i]);t[c].references--}for(var u=n(r,o),s=0;s<a.length;s++){var f=e(a[s]);0===t[f].references&&(t[f].updater(),t.splice(f,1))}a=u}}},569:r=>{"use strict";var t={};r.exports=function(r,e){var n=function(r){if(void 0===t[r]){var e=document.querySelector(r);if(window.HTMLIFrameElement&&e instanceof window.HTMLIFrameElement)try{e=e.contentDocument.head}catch(r){e=null}t[r]=e}return t[r]}(r);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");n.appendChild(e)}},216:r=>{"use strict";r.exports=function(r){var t=document.createElement("style");return r.setAttributes(t,r.attributes),r.insert(t,r.options),t}},565:(r,t,e)=>{"use strict";r.exports=function(r){var t=e.nc;t&&r.setAttribute("nonce",t)}},795:r=>{"use strict";r.exports=function(r){if("undefined"==typeof document)return{update:function(){},remove:function(){}};var t=r.insertStyleElement(r);return{update:function(e){!function(r,t,e){var n="";e.supports&&(n+="@supports (".concat(e.supports,") {")),e.media&&(n+="@media ".concat(e.media," {"));var o=void 0!==e.layer;o&&(n+="@layer".concat(e.layer.length>0?" ".concat(e.layer):""," {")),n+=e.css,o&&(n+="}"),e.media&&(n+="}"),e.supports&&(n+="}");var a=e.sourceMap;a&&"undefined"!=typeof btoa&&(n+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a))))," */")),t.styleTagTransform(n,r,t.options)}(t,r,e)},remove:function(){!function(r){if(null===r.parentNode)return!1;r.parentNode.removeChild(r)}(t)}}}},589:r=>{"use strict";r.exports=function(r,t){if(t.styleSheet)t.styleSheet.cssText=r;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(r))}}}},t={};function e(n){var o=t[n];if(void 0!==o)return o.exports;var a=t[n]={id:n,exports:{}};return r[n](a,a.exports,e),a.exports}e.n=r=>{var t=r&&r.__esModule?()=>r.default:()=>r;return e.d(t,{a:t}),t},e.d=(r,t)=>{for(var n in t)e.o(t,n)&&!e.o(r,n)&&Object.defineProperty(r,n,{enumerable:!0,get:t[n]})},e.o=(r,t)=>Object.prototype.hasOwnProperty.call(r,t),e.nc=void 0,(()=>{"use strict";var r=e(379),t=e.n(r),n=e(795),o=e.n(n),a=e(569),i=e.n(a),c=e(565),u=e.n(c),s=e(216),f=e.n(s),d=e(589),p=e.n(d),l=e(800),v={};v.styleTagTransform=p(),v.setAttributes=u(),v.insert=i().bind(null,"head"),v.domAPI=o(),v.insertStyleElement=f(),t()(l.Z,v),l.Z&&l.Z.locals&&l.Z.locals;var h=e(41),m=function(r,t){var e=$("#statusTxt");e.text(r),e.removeClass("alertTxt"),"error"===t&&e.addClass("alertTxt")};$(document).ready((function(){$("#doEncrypt").click((function(){m("");var r=$("#inputText"),t=$("#outputText"),e=$("#outputTextMD5"),n=r.val();if(!n||n.length>20||0===n.length)return m("Mật khẩu không hợp lệ. Phải ít hơn 20 ký tự.","error");t.val(h.encrypt(n)),e.text(window.md5(n))})),$("#doDecrypt").click((function(){m("");var r=$("#inputText"),t=$("#outputText").val();if(!t||32!=t.length)return m("Mã hóa không hợp lệ. Phải 32 ký tự.","error");r.val(h.decrypt(t))}))}))})()})();