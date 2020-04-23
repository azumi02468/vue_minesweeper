<template>
  <div class="minesweeper">
    <h1>{{ msg }}</h1>
    横：<input type="number" step="1" min="2" v-bind:max="getMaxYoko" name="yoko" id="yoko" v-model.number="area.yoko" />
    縦：<input type="number" step="1" min="2" v-bind:max="getMaxTate" name="tate" id="tate" v-model.number="area.tate" />
    爆弾：<input type="number" step="1" min="1" v-bind:max="getMaxBomb" name="bomb" id="bomb" v-model.number="area.bomb" />
    <button @click="bombShuffle">作成！</button>
    <div id="playground" v-if="isDisp">
      <div>経過時間：{{area.gameTime}}秒</div>
      <!-- スマートフォン用 -->
      <div v-if="isSmartPhone">
        <div>旗を立てる／降ろすには、<br />1秒以上ロングタップしてください。</div>
        <table border="1">
          <tr v-for="(cols,y) in box" :key="y">
            <td v-for="(cell,t) in cols" :key="t" v-on:touchstart="touchstart(cell,$event)" v-on:touchend="touchend(cell,y,t)">
              <div v-if="cell.bombDispKbn === 1">✖︎</div>
              <div v-else-if="cell.bombDispKbn === 2">{{cell.bombNext}}</div>
              <div v-else-if="cell.bombDispKbn === 3">-</div>
              <div v-else-if="cell.flag">🚩</div>
            </td>
          </tr>
        </table>
      </div>

      <!-- PC用 -->
      <div v-else>
        <div>旗を立てる／降ろすには、右クリックしてください。</div>
        <table border="1">
          <tr v-for="(cols,y) in box" :key="y">
            <td v-for="(cell,t) in cols" :key="t" @click="isBomb(cell,y,t)" @click.right.prevent="toggleFlag(cell)">
              <div v-if="cell.bombDispKbn === 1">✖︎</div>
              <div v-else-if="cell.bombDispKbn === 2">{{cell.bombNext}}</div>
              <div v-else-if="cell.bombDispKbn === 3">-</div>
              <div v-else-if="cell.flag">🚩</div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div v-if="area.finish === 1">SUCCESS!</div>
    <div v-if="area.finish === 2">GAME OVER</div>
  </div>
</template>
<script>
// 爆弾配置
let bombShuffle = function(){
  // ゲーム経過時間をクリア
  this.area.gameTime = 0;
  this.resetGameTime();

  // 入力値チェック
  if (!this.checkInput()) return;
  
  // 初期化
  this.area.finish = 0;
  this.box.splice(-this.box.length);
  // 爆弾フラグ
  for (let y=0; y<this.area.yoko; y++){
    this.box.splice(y,1,[]);
    for (let t=0; t<this.area.tate; t++){
      this.box[y].splice(t,1,{
        bomb: 0,
        bombNext: 0,
        bombDispKbn: 0,
        flag: false
      });
    }
  }
  let bombCount = this.area.bomb;
  while(bombCount > 0) {
    let targetY = Math.floor(Math.random() * this.area.yoko);
    let targetT = Math.floor(Math.random() * this.area.tate);

    // すでに爆弾がセットされている場合は他のマスを探す
    if (this.box[targetY][targetT].bomb === 1){
      continue;
    }

    // 爆弾をセットする
    this.box[targetY][targetT].bomb = 1;
        
    // 爆弾の隣のマスにフラグを立てる
    for (let ny=targetY-1;ny<=targetY+1 ; ny++){
      // 配列を超えてしまう場合は次のループ
      if (ny < 0 || ny >= this.area.yoko) {
        continue;
      }
      for (let nt=targetT-1;nt<=targetT+1 ; nt++){
        if (nt < 0 || nt >= this.area.tate) {
          continue;
        }
        if (ny === targetY && nt === targetT){
          continue;
        }
        if (typeof this.box[ny][nt].bombNext !== "undefined"){
          this.box[ny][nt].bombNext = this.box[ny][nt].bombNext + 1;
        }
      }
    }
    
    // 爆弾セット数を1つ減らす
    bombCount--;
  }
  console.log(this.box);
  this.isDisp = true;
}

// 入力チェック
let checkInput = function(){
  let checkFlg = true;
  let errMsg = "";
  const LF = "\n";

  if (this.area.tate < 2 || this.area.tate > this.getMaxTate) {
    errMsg = "縦は2以上"+this.getMaxTate+"以下の数値にしてください。";
    checkFlg = false;
  }
  if (this.area.yoko < 2 || this.area.yoko > this.getMaxYoko) {
    errMsg += LF + "横は2以上"+this.getMaxYoko+"以下の数値にしてください。";
    checkFlg = false;
  }
  if (this.area.bomb <= 0) {
    errMsg += LF + "爆弾は1以上の数値にしてください。";
    checkFlg = false;
  }
  if(!checkFlg){
    alert(errMsg);
    return checkFlg;
  }

  if (this.area.bomb > this.getMaxBomb) {
    errMsg += LF + "爆弾数は"+this.getMaxBomb+"までにしてください。";
    checkFlg = false;
    alert(errMsg);
  }
  return checkFlg;
}

// クリックした場所が爆弾かどうか判定
let isBomb = function(bombFlg,y,t){
  // タイマー起動
  if (!this.gameTimer){
    this.measureGameTime();
  }
  if (bombFlg.bombDispKbn > 0 || bombFlg.flag){
    return;
  }
  if (bombFlg.bomb === 1){
    // console.log("これは爆弾です。");
    alert("あなたは死にました。");
    this.dispAllResult();
    this.area.finish = 2;
    return;
  } 

  if (bombFlg.bombNext > 0){
    //console.log("これは爆弾の隣にあります:"+bombFlg.bombNext);
    bombFlg.bombDispKbn = 2;
  } else {
    //console.log("これは爆弾の近くではありません");
    bombFlg.bombDispKbn = 3;
    // todo
    this.checkNextCell(y,t);
  }
  this.checkSuccess();
}

// クリアできたかどうか
let checkSuccess = function(){
  let successCount = 0;
  for(let i=0;i<this.area.tate;i++){
    successCount = successCount + (this.box[i].filter(cell => cell.bombDispKbn === 0).length);
  }
  if (successCount === this.area.bomb){
    this.area.finish = 1;
    this.dispAllResult();
    alert("おめでとう！クリアしました！");
  }
}

// 全マス結果表示
let dispAllResult = function(){
  for(let y=0;y<this.box.length;y++){
    for(let t=0;t<this.box[y].length;t++){
      if (this.box[y][t].bomb === 1){
        this.box[y].splice(t,1,{
          bomb: this.box[y][t].bomb,
          bombNext: this.box[y][t].bombNext,
          bombDispKbn: 1,
          flag: false
        })
      } else if (this.box[y][t].bombNext > 0) {
        this.box[y].splice(t,1,{
          bomb: this.box[y][t].bomb,
          bombNext: this.box[y][t].bombNext,
          bombDispKbn: 2,
          flag: false
        })
      } else {
        this.box[y].splice(t,1,{
          bomb: this.box[y][t].bomb,
          bombNext: this.box[y][t].bombNext,
          bombDispKbn: 3,
          flag: false
        })
      }
    }
  }
  // 全て表示したらゲーム経過時間を止める
  this.resetGameTime();
}

// 隣のマスチェック
// 左上・上・右上・左・右・左下・下・右下の順に再帰的にチェックする
let checkNextCell = function(y, t){
  // 爆弾の隣のマスにフラグを立てる
  for (let i=y-1;i<=y+1;i++){
    // 配列を超えてしまう場合は次のループ
    if (i < 0 || i >= this.area.yoko) {
      continue;
    }
    for (let j=t-1;j<=t+1;j++){
      // 配列を超えてしまう場合は次のループ
      if (j < 0 || j >= this.area.tate) {
        continue;
      }
      // 自分自身はチェック終わっているため、除外
      if (i === y && j === t){
        continue;
      }
      // 表示が終わっている箇所は対象外
      if (this.box[i][j].bombDispKbn > 0){
        continue;
      }
      // チェック処理
      if (this.box[i][j].bombNext > 0) {
        this.box[i][j].bombDispKbn = 2;
      } else {
        this.box[i][j].bombDispKbn = 3;
        this.checkNextCell(i,j);
      }
    }
  }
}

// 旗をたてる、下ろす
let toggleFlag = function(bombFlg){
  if (bombFlg.bombDispKbn > 0){
    return;
  }
  bombFlg.flag = !bombFlg.flag;
}

// 長タップ時の挙動
let onlongtouch = function(bombFlg) {
  this.timer = null;
  this.toggleFlag(bombFlg);
};

// タップイベント発生時にタイマーを仕掛ける
let touchstart = function(bombFlg,e) {
  let self = this;
  e.preventDefault();
  if (!this.timer) {
    this.timer = setTimeout(function(){self.onlongtouch(bombFlg)}, 1000);
  }
}

// タップイベントが長押しかどうか判定
let touchend = function(bombFlg,y,t) {
  //stops short touches from firing the event
  this.isBomb(bombFlg,y,t);
  if (this.timer) {
    clearTimeout(this.timer);
    this.timer = null;
  }
}

// デバイス判定
let isSmartPhone = function(){
  let ua = navigator.userAgent;
  console.log(ua);
  if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
     return true;
  }else{
      return false;
  }
}

// ゲーム時間測定
let measureGameTime = function(){
  let self = this;
  this.gameTimer = setInterval(function(){
    self.area.gameTime += 1;
  },1000);
}

// ゲーム経過時間を止める
let resetGameTime = function(){
  clearInterval(this.gameTimer);
  this.gameTimer = null;
}

export default {
  name: 'Minesweeper',
  props: {
    msg: String
  },
  computed: {
    getMaxBomb: function(){
      return (this.area.tate * this.area.yoko) - 1
    },
    isSmartPhone: isSmartPhone,
    getMaxTate: function(){
      if (this.isSmartPhone) {
        return this.limit.SP.tate
      } else {
        return this.limit.PC.tate
      }
    },
    getMaxYoko: function(){
      if (this.isSmartPhone) {
        return this.limit.SP.yoko
      } else {
        return this.limit.PC.yoko
      }
    }
  },
  data() {
    return {
      area: {
        tate: 9,
        yoko: 9,
        bomb: 10,
        finish: 0,
        gameTime: 0
      },
      limit: {
        SP: {
          tate: 15,
          yoko: 15
        },
        PC: {
          tate: 50,
          yoko: 50
        }
      },
      isDisp: false,
      box: [] //[[{bomb:0,bombNext:1,bombDispKbn:0},{bomb:1,bombNext:2,bombDispKbn:1}...]]
    }
  },
  methods: {
    checkInput: checkInput,
    bombShuffle: bombShuffle,
    isBomb: isBomb,
    dispAllResult: dispAllResult,
    checkNextCell: checkNextCell,
    toggleFlag: toggleFlag,
    checkSuccess: checkSuccess,
    touchstart: touchstart,
    touchend: touchend,
    onlongtouch: onlongtouch,
    measureGameTime: measureGameTime,
    resetGameTime: resetGameTime  
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

table {
  margin: 0 auto;
  border-collapse: collapse;
}

table td {
    width: 30px;
    height: 30px;
}
</style>