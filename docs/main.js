parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"or4r":[function(require,module,exports) {
var global = arguments[3];
var t=arguments[3],e="Expected a function",n=NaN,r="[object Symbol]",i=/^\s+|\s+$/g,o=/^[-+]0x[0-9a-f]+$/i,u=/^0b[01]+$/i,f=/^0o[0-7]+$/i,c=parseInt,a="object"==typeof t&&t&&t.Object===Object&&t,s="object"==typeof self&&self&&self.Object===Object&&self,v=a||s||Function("return this")(),l=Object.prototype,p=l.toString,b=Math.max,m=Math.min,y=function(){return v.Date.now()};function d(t,n,r){var i,o,u,f,c,a,s=0,v=!1,l=!1,p=!0;if("function"!=typeof t)throw new TypeError(e);function d(e){var n=i,r=o;return i=o=void 0,s=e,f=t.apply(r,n)}function g(t){var e=t-a;return void 0===a||e>=n||e<0||l&&t-s>=u}function O(){var t=y();if(g(t))return x(t);c=setTimeout(O,function(t){var e=n-(t-a);return l?m(e,u-(t-s)):e}(t))}function x(t){return c=void 0,p&&i?d(t):(i=o=void 0,f)}function T(){var t=y(),e=g(t);if(i=arguments,o=this,a=t,e){if(void 0===c)return function(t){return s=t,c=setTimeout(O,n),v?d(t):f}(a);if(l)return c=setTimeout(O,n),d(a)}return void 0===c&&(c=setTimeout(O,n)),f}return n=h(n)||0,j(r)&&(v=!!r.leading,u=(l="maxWait"in r)?b(h(r.maxWait)||0,n):u,p="trailing"in r?!!r.trailing:p),T.cancel=function(){void 0!==c&&clearTimeout(c),s=0,i=a=o=c=void 0},T.flush=function(){return void 0===c?f:x(y())},T}function j(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function g(t){return!!t&&"object"==typeof t}function O(t){return"symbol"==typeof t||g(t)&&p.call(t)==r}function h(t){if("number"==typeof t)return t;if(O(t))return n;if(j(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=j(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(i,"");var r=u.test(t);return r||f.test(t)?c(t.slice(2),r?2:8):o.test(t)?n:+t}module.exports=d;
},{}],"WEtf":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var r={android:function(){return navigator.userAgent.match(/Android/i)},blackberry:function(){return navigator.userAgent.match(/BlackBerry/i)},ios:function(){return navigator.userAgent.match(/iPhone|iPad|iPod/i)},opera:function(){return navigator.userAgent.match(/Opera Mini/i)},windows:function(){return navigator.userAgent.match(/IEMobile/i)},any:function(){return r.android()||r.blackberry()||r.ios()||r.opera()||r.windows()}},e=r;exports.default=e;
},{}],"TAPd":[function(require,module,exports) {
"use strict";function e(){}function t(e){var t=1997,n=6,r=(e[0],null),a="falsetto_percent",o=d3.nest().key(function(e){return e.year}).sortValues(function(e,t){return+t.points-+e.points}).entries(e[0]);function l(e){var t=!0;return"NULL"!=e.falsetto&&"False"!=e.initial_match||(t=!1),s&&t&&"Rap/Hip hop"==e.genre&&(t=!1),u&&t&&10==+e.spoken&&(t=!1),u&&t&&0==+e.register&&(t=!1),d&&t&&-1==["male","duet"].indexOf(e.gender)&&(t=!1),p&&t&&+e.peak_rank>10&&(t=!1),t}function i(e){for(var n in e){var o=0,i=0,s=0;for(var u in e[n].values){l(e[n].values[u])&&(s+=1,e[n].values[u].falsetto>0&&(o+=1),i+=+e[n].values[u].register)}e[n].falsetto_percent=o/s,e[n].register_percent=i/s,e[n].either_percent=0/s}r=d3.map(e,function(e){return e.key}),function(e){console.log("building line chart");var n=d3.select(".line-chart-container");n.selectAll("svg").remove();var o=d3.extent(e,function(e){return e[a]}),l=d3.extent(e,function(e){return+e.key}),i=d3.scaleLinear().domain(l).range([0,200]),s=d3.scaleLinear().domain(o).range([200,0]),u=d3.line().x(function(e){return i(+e.key)}).y(function(e){return s(e[a])}),d=d3.voronoi().x(function(e){return i(+e.key)}).y(function(e){return s(e[a])}).extent([[0,0],[200,200]]),p=n.append("svg").attr("width",200).attr("height",200).datum(e.sort(function(e,t){return+e.key-+t.key})),f=p.append("g").attr("class","circles").selectAll("circle").data(e).enter().append("circle").attr("cx",function(e){return i(e.key)}).attr("cy",function(e){return s(e[a])}).attr("r",2);p.append("g").attr("class","lines").append("path").attr("d",function(e){return u(e)}),p.append("g").attr("class","voronoi").selectAll("path").data(function(t){return d.polygons(e)}).enter().append("path").attr("d",function(e){return e?"M"+e.join("L")+"Z":null}).on("mouseover",function(e){var t=+e.data.key;f.style("fill",function(e){return e.key==t?"red":null}),"falsetto_percent"==a?d3.select(".line-hover").text(+e.data.key+" "+Math.round(100*e.data[a])+"%"):d3.select(".line-hover").text(+e.data.key+" "+Math.round(100*e.data[a])/100)}).on("click",function(e){t=+e.data.key,c(r,+e.data.key)}),c(r,t)}(e)}function c(e,t){var r=d3.select(".song-container");r.selectAll("div").remove();var o=r.selectAll("div").data(e.get(t).values).enter().append("div").attr("class","song-row").classed("missing",function(e){return!function(e){var t=!0;return"NULL"!=e.falsetto&&"False"!=e.initial_match||(t=!1),t}(e)}).classed("filtered",function(e){return!l(e)}).classed("numerator",function(e){return function(e){var t=!1;return"falsetto_percent"==a&&e.falsetto>0&&(t=!0),"register_percent"==a&&e.register>n&&(t=!0),"either_percent"==a&&(e.register>n||e.falsetto>0)&&(t=!0),t}(e)}).on("mouseover",function(e){d3.select(this).select(".song-overlay").style("display","block")}).on("mouseout",function(e){d3.select(this).select(".song-overlay").style("display",null)});o.append("p").attr("class","song-text").text(function(e,t){return t+1+". "+e.song_title.slice(0,25)}),o.append("p").attr("class","song-overlay").style("color",function(e){return e.falsetto>0?"red":null}).text(function(e,t){return t+1+". "+e.song_title+" - "+e.artist_name})}d3.select(".numerator").selectAll("p").on("click",function(e){var t=d3.select(this).attr("value");a=t,i(o)}),d3.select(".viz").selectAll("p").data(d3.range(1958,2019,1)).enter().append("p").text(function(e){return e}).on("click",function(e){i(o)});var s=!1,u=!1,d=!1,p=!1;d3.select("#no-hip-hop").property("disabled",!1).on("change",function(){s=!!this.checked,i(o)}),d3.select("#only-singing").property("disabled",!1).on("change",function(){u=!!this.checked,i(o)}),d3.select("#male-present").property("disabled",!1).on("change",function(){d=!!this.checked,i(o)}),d3.select("#top-10").property("disabled",!1).on("change",function(){p=!!this.checked,i(o)}),i(o)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var n={init:t,resize:e};exports.default=n;
},{}],"v9Q8":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=[{image:"2018_02_stand-up",url:"2018/02/stand-up",hed:"The Structure of Stand-Up Comedy"},{image:"2018_04_birthday-paradox",url:"2018/04/birthday-paradox",hed:"The Birthday Paradox Experiment"},{image:"2018_11_boy-bands",url:"2018/11/boy-bands",hed:"Internet Boy Band Database"},{image:"2018_08_pockets",url:"2018/08/pockets",hed:"Women’s Pockets are Inferior"}],t=null;function n(e,t){var n=document.getElementsByTagName("script")[0],o=document.createElement("script");return o.src=e,o.async=!0,n.parentNode.insertBefore(o,n),t&&"function"==typeof t&&(o.onload=t),o}function o(t){var n=new XMLHttpRequest,o=Date.now(),r="https://pudding.cool/assets/data/stories.json?v=".concat(o);n.open("GET",r,!0),n.onload=function(){if(n.status>=200&&n.status<400){var o=JSON.parse(n.responseText);t(o)}else t(e)},n.onerror=function(){return t(e)},n.send()}function r(e){return"\n\t<a class='footer-recirc__article' href='https://pudding.cool/".concat(e.url,"' target='_blank'>\n\t\t<img class='article__img' src='https://pudding.cool/common/assets/thumbnails/640/").concat(e.image,".jpg' alt='").concat(e.hed,"'>\n\t\t<p class='article__headline'>").concat(e.hed,"</p>\n\t</a>\n\t")}function a(){var e=window.location.href,n=t.filter(function(t){return!e.includes(t.url)}).slice(0,4).map(r).join("");d3.select(".pudding-footer .footer-recirc__articles").html(n)}function s(){var e,t,o,r,a;e=document,t="script",o="facebook-jssdk",a=e.getElementsByTagName(t)[0],e.getElementById(o)||((r=e.createElement(t)).id=o,r.src="//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.7",a.parentNode.insertBefore(r,a)),n("https://platform.twitter.com/widgets.js")}function c(){o(function(e){t=e,a(),s()})}var i={init:c};exports.default=i;
},{}],"xZJw":[function(require,module,exports) {
"use strict";function t(t){return new Promise(function(e,n){d3.csv("assets/data/".concat(t)).then(function(t){e(t)}).catch(n)})}function e(){var e=[t("data.csv")];return Promise.all(e)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=e;
},{}],"epB2":[function(require,module,exports) {
"use strict";var e=a(require("lodash.debounce")),i=a(require("./utils/is-mobile")),s=a(require("./graphic")),t=a(require("./footer")),r=a(require("./load-data"));function a(e){return e&&e.__esModule?e:{default:e}}var l=d3.select("body"),d=0;function c(){var e=l.node().offsetWidth;d!==e&&(d=e,s.default.resize())}function n(){if(l.select("header").classed("is-sticky")){var e=l.select(".header__menu"),i=l.select(".header__toggle");i.on("click",function(){var s=e.classed("is-visible");e.classed("is-visible",!s),i.classed("is-visible",!s)})}}function o(){l.classed("is-mobile",i.default.any()),window.addEventListener("resize",(0,e.default)(c,150)),(0,r.default)().then(function(e){s.default.init(e)}).catch(console.error)}o();
},{"lodash.debounce":"or4r","./utils/is-mobile":"WEtf","./graphic":"TAPd","./footer":"v9Q8","./load-data":"xZJw"}]},{},["epB2"], null)