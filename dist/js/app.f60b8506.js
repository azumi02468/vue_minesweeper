(function(e){function t(t){for(var i,a,b=t[0],s=t[1],l=t[2],c=0,m=[];c<b.length;c++)a=b[c],Object.prototype.hasOwnProperty.call(n,a)&&n[a]&&m.push(n[a][0]),n[a]=0;for(i in s)Object.prototype.hasOwnProperty.call(s,i)&&(e[i]=s[i]);u&&u(t);while(m.length)m.shift()();return r.push.apply(r,l||[]),o()}function o(){for(var e,t=0;t<r.length;t++){for(var o=r[t],i=!0,b=1;b<o.length;b++){var s=o[b];0!==n[s]&&(i=!1)}i&&(r.splice(t--,1),e=a(a.s=o[0]))}return e}var i={},n={app:0},r=[];function a(t){if(i[t])return i[t].exports;var o=i[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,a),o.l=!0,o.exports}a.m=e,a.c=i,a.d=function(e,t,o){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},a.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(a.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)a.d(o,i,function(t){return e[t]}.bind(null,i));return o},a.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="/";var b=window["webpackJsonp"]=window["webpackJsonp"]||[],s=b.push.bind(b);b.push=t,b=b.slice();for(var l=0;l<b.length;l++)t(b[l]);var u=s;r.push([0,"chunk-vendors"]),o()})({0:function(e,t,o){e.exports=o("56d7")},"034f":function(e,t,o){"use strict";var i=o("85ec"),n=o.n(i);n.a},"3b5f":function(e,t,o){"use strict";var i=o("a386"),n=o.n(i);n.a},"56d7":function(e,t,o){"use strict";o.r(t);o("e260"),o("e6cf"),o("cca6"),o("a79d");var i=o("2b0e"),n=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{attrs:{id:"app"}},[o("Minesweeper",{attrs:{msg:"マインスイーパー"}})],1)},r=[],a=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"minesweeper"},[o("h1",[e._v(e._s(e.msg))]),e._v(" 横："),o("input",{directives:[{name:"model",rawName:"v-model",value:e.yoko,expression:"yoko"}],attrs:{type:"number",step:"1",min:"2",name:"yoko",id:"yoko"},domProps:{value:e.yoko},on:{input:function(t){t.target.composing||e.$set(e.area,"yoko",t.target.value)}}}),e._v(" 縦："),o("input",{directives:[{name:"model",rawName:"v-model",value:e.tate,expression:"tate"}],attrs:{type:"number",step:"1",min:"2",name:"tate",id:"tate"},domProps:{value:e.tate},on:{input:function(t){t.target.composing||e.$set(e.area,"tate",t.target.value)}}}),e._v(" 爆弾："),o("input",{directives:[{name:"model",rawName:"v-model",value:e.bomb,expression:"bomb"}],attrs:{type:"number",step:"1",min:"1",max:e.getMaxBomb,name:"bomb",id:"bomb"},domProps:{value:e.bomb},on:{input:function(t){t.target.composing||e.$set(e.area,"bomb",t.target.value)}}}),o("button",{on:{click:e.bombShuffle}},[e._v("作成！")]),e.isDisp?o("div",{attrs:{id:"playground"}},[o("table",{attrs:{border:"1"}},e._l(e.box,(function(t,i){return o("tr",{key:i},e._l(t,(function(t,n){return o("td",{key:n,on:{click:function(o){return e.isBomb(t,i,n)},contextmenu:function(o){return o.preventDefault(),e.toggleFlag(t)}}},[1===t.bombDispKbn?o("div",[e._v("✖︎")]):2===t.bombDispKbn?o("div",[e._v(e._s(t.bombNext))]):3===t.bombDispKbn?o("div",[e._v("-")]):t.flag?o("div",[e._v("🚩")]):e._e()])})),0)})),0),1===e.finish?o("div",[e._v("SUCCESS!")]):e._e(),2===e.finish?o("div",[e._v("GAME OVER")]):e._e()]):e._e()])},b=[],s=(o("4de4"),o("a434"),function(){if(this.bomb>this.getMaxBomb)alert("爆弾数は"+this.getMaxBomb+"までにしてください。");else{this.finish=0,this.box.splice(-this.box.length);for(var e=0;e<this.yoko;e++){this.box.splice(e,1,[]);for(var t=0;t<this.tate;t++)this.box[e].splice(t,1,{bomb:0,bombNext:0,bombDispKbn:0,flag:!1})}var o=this.bomb;while(o>0){var i=Math.floor(Math.random()*this.yoko),n=Math.floor(Math.random()*this.tate);if(1!==this.box[i][n].bomb){this.box[i][n].bomb=1;for(var r=i-1;r<=i+1;r++)if(!(r<0||r>=this.yoko))for(var a=n-1;a<=n+1;a++)a<0||a>=this.tate||r===i&&a===n||"undefined"!==typeof this.box[r][a].bombNext&&(this.box[r][a].bombNext=this.box[r][a].bombNext+1);o--}}console.log(this.box),this.isDisp=!0}}),l=function(e,t,o){if(!(e.bombDispKbn>0||e.flag)){if(1===e.bomb)return alert("あなたは死にました。"),this.dispAllResult(),void(this.finish=2);e.bombNext>0?e.bombDispKbn=2:(e.bombDispKbn=3,this.checkNextCell(t,o)),this.checkSuccess()}},u=function(){for(var e=0,t=0;t<this.tate;t++)e+=this.box[t].filter((function(e){return 0===e.bombDispKbn})).length;e===this.bomb&&(this.finish=1,this.dispAllResult(),alert("おめでとう！クリアしました！"))},c=function(){for(var e=0;e<this.box.length;e++)for(var t=0;t<this.box[e].length;t++)1===this.box[e][t].bomb?this.box[e].splice(t,1,{bomb:this.box[e][t].bomb,bombNext:this.box[e][t].bombNext,bombDispKbn:1,flag:!1}):this.box[e][t].bombNext>0?this.box[e].splice(t,1,{bomb:this.box[e][t].bomb,bombNext:this.box[e][t].bombNext,bombDispKbn:2,flag:!1}):this.box[e].splice(t,1,{bomb:this.box[e][t].bomb,bombNext:this.box[e][t].bombNext,bombDispKbn:3,flag:!1})},m=function(e,t){for(var o=e-1;o<=e+1;o++)if(!(o<0||o>=this.yoko))for(var i=t-1;i<=t+1;i++)i<0||i>=this.tate||o===e&&i===t||this.box[o][i].bombDispKbn>0||(this.box[o][i].bombNext>0?this.box[o][i].bombDispKbn=2:(this.box[o][i].bombDispKbn=3,this.checkNextCell(o,i)))},p=function(e){e.bombDispKbn>0||(e.flag=!e.flag)},f={name:"Minesweeper",props:{msg:String},computed:{getMaxBomb:function(){return this.tate*this.yoko}},data:function(){return{area:{tate:9,yoko:9,bomb:10,finish:0},isDisp:!1,box:[]}},methods:{bombShuffle:s,isBomb:l,dispAllResult:c,checkNextCell:m,toggleFlag:p,checkSuccess:u}},h=f,v=(o("3b5f"),o("2877")),d=Object(v["a"])(h,a,b,!1,null,"4da2b996",null),x=d.exports,g={name:"App",components:{Minesweeper:x}},y=g,_=(o("034f"),Object(v["a"])(y,n,r,!1,null,null,null)),k=_.exports;i["a"].config.productionTip=!1,new i["a"]({render:function(e){return e(k)}}).$mount("#app")},"85ec":function(e,t,o){},a386:function(e,t,o){}});
//# sourceMappingURL=app.f60b8506.js.map