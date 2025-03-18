<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SeptCollapse from './SeptCollapse.vue';

interface Col {
  row: number,
  col: number,
  block: number,
  blockPos: number,
  label: number,
  fixed: boolean,
  avails: number[],
  error: boolean,
};

interface Row {
  row: number,
  cols: Col[],
};

interface Board {
  rows: Row[],
};

interface Button {
  button: number,
  selected: boolean,
  end: boolean,
  label: number,
};

const board = ref({
  rows: []
} as Board);
const stage = ref(-1);
const mode = ref('easy');
const beginTime = ref(0);
const timer = ref('00:00:00');
const goalTime = ref('');
const buttons = ref([] as Button[]);
const guides = ref([] as number[][]);
const selectNum = ref(1);
const showGuide = ref(false);
const samples = [
        '724596381580000064901080502800020006309618705600050003406030107270000039135967248',
        '068192340729000158010785020805209604604010209102603805040327080287000463051864790',
        '021060840483521976790000051010845090074139520050276030230000065165394782047050310',
        '800354001054912870021070540540000019789020435210000068095060380078235190100498007',
        '070189040408000107190746058807365409604971803309428705980634071506000902030592080',
        '091080560063040890800000001000876000054109780000524000100000004037010650045090120',
        '800907006050103020902000801016839270000615000098742610105000403040301060700406002',
        '500978004900000007042000890008307600005010300009204700014000980300000002800642003',
        '097000120002179300000205000970804015080010060310506097000702000003451900021000570',
        '000000000680157049940060071020706080890010063070508010210040097430271056000000000',
        '890000075407000309032000640000376000000819000000524000064000290709000804580000063',
        '001050300860000042570000091000628000002513700000947000410000087350000024006080100',
        '004386900000090000901000302700030006380612045200040003403000108000070000008423500',
        '000090000052000860081030970000486000609517402000329000098060130027000690000070000',
        '000805000500000008980704031405309806000010000809607205270106094100000002000402000',
        '076020130005000200100803009200658007007431900800297005700305001002000800061080590',
        '700000008000137000006258400360020014520804073410070029005786300000591000600000005',
        '200000001003020600091653840008579100057102480002864900036947210009010300100000009',
        '800000001097060450021070680000439000039215860000786000082040530046050210100000008',
        '001000200580701049640090071030605090200010004060304010410050063850106027006000100',
        '001060900600308005450000061010050090004831500080020030130000057500903002007040300',
        '300090001004501700091000680030207010800000005010904020053000260008705100100030009',
        '260000053053070420004030600000307000480020065000405000005040800078010590640000032',
        '070040030304000905090050060000587000408231706000496000040060020507000308020070050',
        '605000107080070050003905200300807004040010070500409008009308400060040090401000805'
      ] as string[];
const end = ref(false);

onMounted(() => { initialize(); });

const initialize = () => {
  for (let r = 0; r < 9; r++) {
    const cols = [] as Col[];
    for (let c = 0; c < 9; c++) {
      cols.push({
        row: r,
        col: c,
        block: Math.floor(r / 3) * 3 + Math.floor(c / 3),
        blockPos: (r % 3) * 3 + (c % 3),
        label: 0,
        fixed: false,
        avails: [],
        error: false
      })
    }
    board.value.rows.push({
      row: r,
      cols: cols
    });
    buttons.value.push({
      button: r,
      selected: r === 0,
      end: false,
      label: r + 1
    });
  }
  for (let r = 0; r < 3; r++) {
    const cols = [];
    for (let c = 0; c < 3; c++) {
      cols.push(r * 3 + c + 1);
    }
    guides.value.push(cols)
  }
  setInterval(() => { tick(); }, 1000);
};

const tick = () => {
  if (beginTime.value === 0) {
    timer.value = '0:00:00';
    return;
  }
  const now = new Date();
  const diff = Math.floor((now.getTime() - beginTime.value) / 1000);
  const h = Math.floor(diff / 3600);
  const m = Math.floor(diff / 60) % 60;
  const s = diff % 60;
  timer.value = h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
};

const newGame = () => {
  const o = mode.value === 'easy' ? 0 : (mode.value === 'normal' ? 7 : 15);
  stage.value = o + Math.floor(Math.random() * 10);
  resetGame();
};

const clearGame = () => {
  stage.value = -1;
  showGuide.value = false;
  resetGame();
};

const resetGame = () => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = stage.value === -1 ? 0 : parseInt(samples[stage.value].charAt(r * 9 + c));
      board.value.rows[r].cols[c].label = v;
      board.value.rows[r].cols[c].fixed = v != 0
    }
  }
  beginTime.value = stage.value === -1 ? 0 : new Date().getTime();
  timer.value = '0:00:00';
  check();
};

const select = (button: Button) => {
  buttons.value.forEach((b: Button) => {b.selected = button === b});
  selectNum.value = button.label;
};

const onClick = (cell: Col) => {
  if (cell.fixed || end.value) {
    return;
  }
  if (cell.label != selectNum.value) {
    cell.label = selectNum.value;
  } else {
    cell.label = 0;
  }
  check();
};

const check = () => {
  // カウンタ初期化
  const counter = [] as number[][][];
  for (let t = 0; t < 3; t++) {
    counter[t] = [] as number[][];
    for (let u = 0; u < 9; u++) {
      counter[t][u] = [] as number[];
      for (let v = 0; v < 10; v++) {
        counter[t][u][v] = 0;
      }
    }
  }
  // 全ブロックを数え上げる
  board.value.rows.forEach((row: Row) => {
    row.cols.forEach((cell: Col) => {
      counter[0][cell.row][cell.label]++;
      counter[1][cell.col][cell.label]++;
      counter[2][cell.block][cell.label]++;
    });
  });
  // ブロックごと：欠落している数字は何か、重複している数字は何か
  // セルごとに：所属するブロックすべてに欠落している数字が候補
  board.value.rows.forEach((row: Row) => {
    row.cols.forEach((cell: Col) => {
      cell.error = counter[0][cell.row][cell.label] > 1 ||
        counter[1][cell.col][cell.label] > 1 ||
        counter[2][cell.block][cell.label] > 1;
      cell.avails.splice(0, cell.avails.length);
      for (let n = 1; n <= 9; n++) {
        if (counter[0][cell.row][n] === 0 &&
          counter[1][cell.col][n] === 0 &&
          counter[2][cell.block][n] === 0) {
          cell.avails.push(n);
        }
      }
    });
  });
  // 揃っている数字を調査
  let allok = 0;
  for (let v = 1; v < 10; v++) {
    let ok = 0;
    for (let t = 0; t < 3; t++) {
      for (let u = 0; u < 9; u++) {
        if (counter[t][u][v] === 1) {
          ok++;
        }
      }
    }
    buttons.value[v - 1].end = ok === 27;
    if (ok === 27) {
      allok++;
    }
  }
  end.value = allok === 9;
  if (end.value && beginTime.value) {
    goalTime.value = timer.value;
    beginTime.value = 0;
  }
};

const onMenu = (index: string) => {
  if (index === 'new') {
    newGame();
  } else if (index === 'reset') {
    resetGame();
  } else if (index === 'easy' || index === 'normal' || index === 'hard') {
    mode.value = index;
  } else if (index === 'guide') {
    showGuide.value = !showGuide.value;
  } else if (index === 'clear') {
    clearGame();
  }
};

</script>
  
<template>
  <div class="sudokuGame">
    <sept-collapse title="Sudoku" :showHeader="true" :state="false">
      <div>
        <div class="timer">
          {{ timer }}
        </div>
        <el-menu mode="horizontal" @select="onMenu">
          <el-sub-menu index="file">
            <template #title>Game</template>
            <el-menu-item index="new">New</el-menu-item>
            <el-menu-item index="reset">Reset</el-menu-item>
            <el-menu-item index="clear">Clear</el-menu-item>
            <el-sub-menu index="mode">
              <template #title>Mode</template>
              <el-menu-item index="easy"><el-icon v-if="mode === 'easy'"><Select/></el-icon>Easy</el-menu-item>
              <el-menu-item index="normal"><el-icon v-if="mode === 'normal'"><Select/></el-icon>Normal</el-menu-item>
              <el-menu-item index="hard"><el-icon v-if="mode === 'hard'"><Select/></el-icon>Hard</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="hint">
              <template #title>Hint</template>
              <el-menu-item index="guide"><el-icon v-if="showGuide"><Select/></el-icon>Show guide</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
        </el-menu>
        <div v-if="end" class="goal">
          <div class="goalMessage">
            Complete!
          </div>
          <div class="goalElments">
            Time: {{ goalTime }}<br/>
            <el-button @click="clearGame()">OK</el-button>
          </div>
        </div>
        <table class="board">
          <template v-for="(r, ri) in board.rows" :key="ri">
            <tr>
              <template v-for="(c, ci) in r.cols" :key="ci">
                <td @click="onClick(c)" :class="{ error: c.error, b0: c.blockPos === 0, b1: c.blockPos === 1, b2: c.blockPos === 2, b3: c.blockPos === 3, b4: c.blockPos === 4, b5: c.blockPos === 5, b6: c.blockPos === 6, b7: c.blockPos === 7, b8: c.blockPos === 8}">
                  <template v-if="c.label">
                    <div :class="{ fixed: c.fixed }">{{ c.label }}</div>
                  </template>
                  <template v-else>
                    <table class="guide">
                      <template v-for="(gr, gri) in guides" :key="gri">
                        <tr>
                          <template v-for="(gc, gci) in gr" :key="gci">
                            <td :class="{ selected: gc === selectNum }">
                              <template v-if="showGuide && c.avails.indexOf(gc) >= 0">{{ gc }}</template>
                              <template v-else>&nbsp;</template>
                            </td>
                          </template>
                        </tr>
                      </template>
                    </table>
                  </template>
                </td>
              </template>
            </tr>
          </template>
          <tr>
            <template v-for="(b, bi) in buttons" :key="bi">
              <td :class="{ button: true, selected: b.selected, end: b.end }" @click="select(b)">
                <div>{{ b.label }}</div>
              </td>
            </template>
          </tr>
        </table>
      </div>
    </sept-collapse>
  </div>
</template>

<style scoped>
table, td {
  border-collapse: collapse;
  text-align: center;
  margin: 0;
  padding: 0;
}
table.board>tr>td {
  border: 1px solid silver;
  cursor: pointer;
  width: 2em;
  text-align: center;
}
table.board>tr>td.error {
  color: red;
}
table.board>tr>td.b0 {
  border-top-color: black;
  border-left-color: black;
}
table.board>tr>td.b1 {
  border-top-color: black;
}
table.board>tr>td.b2 {
  border-top-color: black;
  border-right-color: black;
}
table.board>tr>td.b3 {
  border-left-color: black;
}
table.board>tr>td.b5 {
  border-right-color: black;
}
table.board>tr>td.b6 {
  border-bottom-color: black;
  border-left-color: black;
}
table.board>tr>td.b7 {
  border-bottom-color: black;
}
table.board>tr>td.b8 {
  border-bottom-color: black;
  border-right-color: black;
}
table.board>tr>td>div.fixed {
  color: #999;
  font-weight: bold;
  text-shadow: 1px 1px 1px #000;
  background: #eee;
  height: 2em;
  cursor: default;
}
table.guide {
  margin: auto;
}
table.guide>tr>td {
  color: #9c9;
  line-height: 1em;
  font-size: 0.3em;
  width: 0.3em;
}
table.guide>tr>td.selected {
  color: #060;
}
td.button>div {
  cursor: pointer;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 1px outset #ccc;
  background:#ccc;
  color: white;
  text-shadow: 0 0 1px #000;
  font-weight: bold;
}
td.button.selected>div {
  border: 1px inset #ccc;
  background:#999;
}
td.button.end>div {
  color: green;
}
div.goal {
  position: relative;
  height: 0;
}
div.goalElments {
  position: relative;
  top: 7em;
  text-align: center;
  width: calc(100% - 1em);
  box-sizing: border-box;
  border-radius: 0.5em;
  color: #fff;
  padding: 1em;
  margin: 0.5em;
  text-shadow: 0px 0px 4px #000;
  background: rgba(0,0,0,0.5);
  font-weight: bold;
}

div.goalMessage {
  position: relative;
  top: 2em;
  left: -0.2em;
  font-family: 'Lobster';
  font-size: 3em;
  transform: rotate(-10deg);
  text-align: center;
  font-weight: bold;
  color: #3f9;
  text-shadow: 4px 4px 4px #000;
}

div.timer {
  float: right;
  display: inline-block;
  font-size:small;
}

.slide-enter-active, .slide-leave-active {
  transition: opacity .5s;
}
.slide-enter, .slide-leave-to {
  opacity: 0;
}

</style>