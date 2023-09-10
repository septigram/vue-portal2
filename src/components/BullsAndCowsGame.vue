<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SeptCollapse from './SeptCollapse.vue';

interface Board {
  turn: number,
  state: string[],
  bulls: number,
  cows: number,
};

const maxTurn = 12;
const n = 4;
let pos = ref(0);
let turn = ref(0);
const board = ref([] as Board[]);
const goal = [] as string[];
const vals = [
  { v: '0', },
  { v: '1', },
  { v: '2', },
  { v: '3', },
  { v: '4', },
  { v: '5', },
  { v: '6', },
  { v: '7', },
  { v: '8', },
  { v: '9', }
];
let end = false;
let beginTime = 0;
let timer = ref('');
let goalTime = ref('');

onMounted(() => {
  setInterval(() => { tick(); }, 1000);
});

const newGame = () => {
  beginTime = new Date().getTime();
  const seed = [] as number[];
  for (let i = 0; i < vals.length; i++) {
    seed.push(i)
  }
  for (let i = 0; i < seed.length; i++) {
    const r = Math.floor(Math.random() * seed.length);
    const tmp = seed[i];
    seed[i] = seed[r];
    seed[r] = tmp;
  }
  goal.splice(0, goal.length);
  for (let i = 0; i < n; i++) {
    goal.push(seed[i].toString());
  }
  board.value.splice(0, board.value.length);
  for (let t = 0; t < maxTurn; t++) {
    const b = {
      turn: t + 1,
      state: [],
      bulls: 0,
      cows: 0,
    } as Board;
    for (let i = 0; i < n; i++) {
      b.state.push('');
    }
    board.value[t] = b;
  }
  turn.value = 0;
  pos.value = 0;
  end = false;
};

const append = (v: string) => {
  if (turn.value >= maxTurn) {
    return;
  }
  const b = board.value[turn.value];
  if (pos.value < n) {
    b.state[pos.value] = v;
    pos.value++;
  }
};

const cls = () => {
  if (turn.value >= maxTurn) {
    return;
  }
  pos.value = 0;
  const b = board.value[turn.value];
  for (let i = 0; i < n; i++) {
    b.state[i] = '';
  }
};

const check = () => {
  if (turn.value >= maxTurn) {
    return;
  }
  if (pos.value != n) {
    return;
  }
  const b = board.value[turn.value];
  let bulls = 0;
  let cows = 0;
  for (let i = 0; i < n; i++) {
    if (b.state[i] === goal[i]) {
      bulls++;
    } else {
      for (let j = 0; j < n; j++) {
        if (i !== j && b.state[i] === goal[j]) {
          cows++
        }
      }
    }
  }
  b.bulls = bulls;
  b.cows = cows;
  if (bulls === n) {
    end = true;
    goalTime.value = timer.value;
  } else {
    turn.value++;
    pos.value = 0;
  }
};

const clear = () => {
  end = false;
  newGame();
};

const tick = () => {
  if (beginTime === 0) {
    timer.value = '0:00:00';
    return;
  }
  const now = new Date();
  const diff = Math.floor((now.getTime() - beginTime) / 1000);
  const h = Math.floor(diff / 3600);
  const m = Math.floor(diff / 60) % 60;
  const s = diff % 60;
  timer.value = h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
};

</script>

<template>
  <div class="bullsAndCowsGame">
    <sept-collapse title="BullsAndCows" :showHeader="true" :state="false">
      <div v-if='end' class="goal">
        <div class="goalMessage">
          Complete!
        </div>
        <div class="goalElments">
          Time: {{ goalTime }}<br/>
          <el-button @click="clear">OK</el-button>
        </div>
      </div>
      <div :class="{end}">
        {{timer}}
        <el-button @click="newGame" size="small">New game</el-button>
        <a href="https://en.wikipedia.org/wiki/Bulls_and_Cows" target="_blank">rule</a><br/>
        <div class="c c0" @click="append('0')">0</div>
        <div class="c c1" @click="append('1')">1</div>
        <div class="c c2" @click="append('2')">2</div>
        <div class="c c3" @click="append('3')">3</div>
        <div class="c c4" @click="append('4')">4</div><br/>
        <div class="c c5" @click="append('5')">5</div>
        <div class="c c6" @click="append('6')">6</div>
        <div class="c c7" @click="append('7')">7</div>
        <div class="c c8" @click="append('8')">8</div>
        <div class="c c9" @click="append('9')">9</div><br/>
        <div class="cmd cc" @click="cls()">Clear</div>
        <div class="cmd cv" @click="check()"><el-icon><Check/></el-icon>Check</div>
        <template v-for="(b, bi) in board" :key="bi">
          <div :class="{ turn: true, current: turn === bi, cleard: bi < turn }">
            {{b.turn}}
            <template v-for="(n, ni) in b.state" :key="ni">
              <div :class="{
                c: true,
                c0: n === '0',
                c1: n === '1',
                c2: n === '2',
                c3: n === '3',
                c4: n === '4',
                c5: n === '5',
                c6: n === '6',
                c7: n === '7',
                c8: n === '8',
                c9: n === '9',
                cursor: turn === bi && pos === ni,
              }">{{n !== '' ? n : '&nbsp;' }}</div>
            </template>
            Bulls: {{b.bulls}}
            Cows: {{b.cows}}
          </div>
        </template>
      </div>
    </sept-collapse>
  </div>
</template>

<style scoped>
div.turn {
  background: #ccc;
  border: 1px solid #999;
  text-align: right;
  margin: 1px;
  padding: 0 2px;
}
div.current {
  background: #fff;
}
div.cleard {
  background: #eee;
}
div.c {
  display: inline-block;
  margin: 2px;
  padding: 0.5em;
  border-radius: 0.5em;
  cursor: pointer;
  border: 1px solid #999;
  width: 1em;
  text-align: center;
  font-weight: 700;
}
div.cmd {
  display: inline-block;
  margin: 2px;
  padding: 0.5em;
  border-radius: 0.5em;
  cursor: pointer;
  border: 1px solid #999;
  text-align: center;
  font-weight: 700;
}
div.c0 {
  color: #924;
  background: #eab;
}
div.c1 {
  color: #942;
  background: #eba;
}
div.c2 {
  color: #972;
  background: #eda;
}
div.c3 {
  color: #792;
  background: #dea;
}
div.c4 {
  color: #392;
  background: #bea;
}
div.c5 {
  color: #295;
  background: #aec;
}
div.c6 {
  color: #298;
  background: #aee;
}
div.c7 {
  color: #269;
  background: #ace;
}
div.c8 {
  color: #229;
  background: #aae;
}
div.c9 {
  color: #629;
  background: #cae;
}
div.cc {
  color: #333;
  background: #eee;
}
div.cv {
  color: #ccc;
  background: #333;
}

div.cursor {
  border-color: red;
  border-width: 2px;
}
div.end {
  -ms-filter: blur(3px);
  filter: blur(3px);
}
div.goal {
  position: relative;
  height: 0;
  z-index: 999;
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
</style>
