<template>
  <div class="minesweeper">
    <h1>{{ msg }}</h1>
    横：<input type="number" step="1" min="2" name="yoko" id="yoko" v-model.number="area.yoko" />
    縦：<input type="number" step="1" min="2" name="tate" id="tate" v-model.number="area.tate" />
    爆弾：<input type="number" step="1" min="1" v-bind:max="getMaxBomb" name="bomb" id="bomb" v-model.number="area.bomb" />
    <button @click="bombShuffle">作成！</button>

    <div id="playground" v-if="isDisp">
      <table border="1">
        <tr v-for="(cols,y) in box" :key="y">
          <td v-for="(cell,t) in cols" :key="t" @click="isBomb(cell,y,t)" @click.right.prevent="toggleFlag(cell)"
           @touchstart="onTouchStart(cell, $event)" @touchend="onTouchEnd(cell)">
            <div v-if="cell.bombDispKbn === 1">✖︎</div>
            <div v-else-if="cell.bombDispKbn === 2">{{cell.bombNext}}</div>
            <div v-else-if="cell.bombDispKbn === 3">-</div>
            <div v-else-if="cell.flag">🚩</div>
          </td>
        </tr>
      </table>
      <div v-if="area.finish === 1">SUCCESS!</div>
      <div v-if="area.finish === 2">GAME OVER</div>
    </div>
  </div>
</template>

<script>
// 爆弾配置
let bombShuffle = function(){
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
  if (this.area.tate < 2) {
    alert("縦は2以上の数値にしてください。");
    checkFlg = false;
  }
  if (this.area.yoko < 2) {
    alert("横は2以上の数値にしてください。");
    checkFlg = false;
  }
  if (this.area.bomb <= 0) {
    alert("爆弾は1以上の数値にしてください。");
    checkFlg = false;
  }
  if (this.area.bomb > this.getMaxBomb) {
    alert("爆弾数は"+this.getMaxBomb+"までにしてください。");
    checkFlg = false;
  }
  return checkFlg;
}

// クリックした場所が爆弾かどうか判定
let isBomb = function(bombFlg,y,t){
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
}

// 隣のマスチェック
// 上下左右の隣を再帰的に確認していく
// y:yoko 0 <= y <= this.area.yoko
// t:tate 0 <= t <= this.area.tate
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

// タイマー
let touch_time = 0;
// タッチフラグ
let touched = false;

// タッチイベントを拾う(秒読スタート)
let onTouchStart = function(bombFlg, e){
  let touchFlg = false;
  if (e.type === "touchstart") {
    touchFlg = true;
    touched = true;
  }

  // イベント判定
  // タッチ時
  if (touchFlg) {
    document.interval = setInterval(function(){
      touch_time += 100;
      if (touch_time == 1000) {
        // ロングタップ(タップから約1秒)時の処理
        this.toggleFlag(bombFlg);
      }
    }, 100);
  // クリック時
  } else {
    this.isBomb(bombFlg);
  }
}

// タッチイベントの終了
let onTouchEnd = function(bombFlg){
  if (touched) {
    if (touch_time < 1000 ) {
      // 短いタップでの処理
      this.isBomb(bombFlg);
    }
  }
  touched = false;
  clearInterval(document.interval);
}

// 旗をたてる、下ろす
let toggleFlag = function(bombFlg){
  if (bombFlg.bombDispKbn > 0){
    return;
  }
  bombFlg.flag = !bombFlg.flag;
}

export default {
  name: 'Minesweeper',
  props: {
    msg: String
  },
  computed: {
    getMaxBomb: function(){
      return this.area.tate * this.area.yoko
    }
  },
  data() {
    return {
      area: {
        tate: 9,
        yoko: 9,
        bomb: 10,
        finish: 0
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
    onTouchStart: onTouchStart,
    onTouchEnd: onTouchEnd
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