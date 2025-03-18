<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';
import AddressList from './components/AddressList.vue';
import AnalogClock from './components/AnalogClock.vue';
import AsciiList from './components/AsciiList.vue';
import BullsAndCowsGame from './components/BullsAndCowsGame.vue';
import CalculatorTool from './components/CalculatorTool.vue';
import CheckToday from './components/CheckToday.vue';
import CodeConvert from './components/CodeConvert.vue';
import ColorWheel from './components/ColorWheel.vue';
import GenPassword from './components/GenPassword.vue';
import GrepTool from './components/GrepTool.vue';
import JsonTool from './components/JsonTool.vue';
import MemoTool from './components/MemoTool.vue';
import MonthlyCalender from './components/MonthlyCalender.vue';
import SudokuGame from './components/SudokuGame.vue';
import TimeConvert from './components/TimeConvert.vue';
import CopyAndPaste from './components/CopyAndPaste.vue';
import ResolutionTable from './components/ResolutionTable.vue';

interface ComponentInfo {
  name: string,
  type: string,
  checked: boolean,
};

const version = 'v2.25.318';

const showComponentEdit = ref(false);
const defaultComponents: ComponentInfo[] = [
  { name: '時計', type: 'clock', checked: true },
  { name: 'カレンダー', type: 'calendar', checked: true },
  { name: 'ブックマーク', type: 'address-list', checked: true },
  { name: '計算機', type: 'calculator', checked: true },
  { name: 'JSON変換', type: 'json-tool', checked: true },
  { name: 'ASCII表', type: 'ascii', checked: true },
  { name: 'URL変換', type: 'code-convert', checked: true },
  { name: 'UNIX時間変換', type: 'time-convert', checked: true },
  { name: 'カラーホイール', type: 'color-wheel', checked: true },
  { name: 'grep', type: 'grep-tool', checked: true },
  { name: 'ちょいメモ', type: 'memo', checked: true },
  { name: '毎日チェック', type: 'check-today', checked: true },
  { name: 'パスワード生成', type: 'gen-password', checked: true },
  { name: 'ナンプレ', type: 'sudoku', checked: true },
  { name: 'Bulls and Cows', type: 'bulls-and-cows', checked: true },
  { name: 'Copy and Paste', type: 'copy-and-paste', checked: true },
  { name: '解像度表', type: 'resolution-table', checked: true },
];
const components = ref(defaultComponents);

onMounted(() => { initialize(); });

const initialize = () => {
  if (!window.localStorage) {
    return;
  }
  const comp = window.localStorage.getItem('vue-portal1-comp')
  if (comp) {
    components.value = JSON.parse(comp) as ComponentInfo[];
    const checks: boolean[] = new Array(defaultComponents.length);
    const remove: boolean[] = new Array(defaultComponents.length);
    for (let i = 0; i < components.value.length; i++) {
      const c = components.value[i];
      const idx = defaultComponents.findIndex((d) => d.type === c.type);
      if (idx >= 0) {
        checks[idx] = true;
      } else {
        remove[i] = true;
      }
    }
    for (let i = 0; i < defaultComponents.length; i++) {
      if (checks[i] === undefined) {
        components.value.push(defaultComponents[i]);
      }
    }
    for (let i = remove.length - 1; i >= 0; i--) {
      if (remove[i]) {
        components.value.splice(i, 1);
      }
    }
  }
};

const onClear = () => {
  if (window.localStorage && window.confirm('初期化しますか？')) {
    window.localStorage.removeItem('vue-portal1-comp');
    components.value = defaultComponents;
  }
}

const onUpdate = () => {
  showComponentEdit.value = false;
  if (window.localStorage) {
    window.localStorage.setItem('vue-portal1-comp', JSON.stringify(components.value));
  }
};

</script>

<template>
  <div>
    <div style="float: right;">
      <el-button @click="showComponentEdit = true;" size="small"><el-icon><Setting/></el-icon></el-button>
    </div>
    <template v-for="(component, ci) in components" :key="ci">
      <li>
        <template v-if="component.checked">
          <template v-if="component.type === 'clock'"><AnalogClock/></template>
          <template v-else-if="component.type === 'calendar'"><MonthlyCalender/></template>
          <template v-else-if="component.type === 'calculator'"><CalculatorTool/></template>
          <template v-else-if="component.type === 'address-list'"><AddressList/></template>
          <template v-else-if="component.type === 'json-tool'"><JsonTool/></template>
          <template v-else-if="component.type === 'color-wheel'"><ColorWheel/></template>
          <template v-else-if="component.type === 'ascii'"><AsciiList/></template>
          <template v-else-if="component.type === 'code-convert'"><CodeConvert/></template>
          <template v-else-if="component.type === 'time-convert'"><TimeConvert/></template>
          <template v-else-if="component.type === 'grep-tool'"><GrepTool/></template>
          <template v-else-if="component.type === 'memo'"><MemoTool/></template>
          <template v-else-if="component.type === 'sudoku'"><SudokuGame/></template>
          <template v-else-if="component.type === 'check-today'"><CheckToday/></template>
          <template v-else-if="component.type === 'gen-password'"><GenPassword/></template>
          <template v-else-if="component.type === 'bulls-and-cows'"><BullsAndCowsGame/></template>
          <template v-else-if="component.type === 'copy-and-paste'"><CopyAndPaste/></template>
          <template v-else-if="component.type === 'resolution-table'"><ResolutionTable/></template>
          <template v-else>
            unknown:{{component.type}}
          </template>
        </template>
      </li>
    </template>
    <div class="version">{{ version }}</div>
    <el-dialog v-model="showComponentEdit" title="表示コンポーネント">
      <div class="componentList">
        <vue-draggable-next v-model="components" el="div" ghost="ghost">
          <template v-for="(component, ci) in components" :key="ci">
            <div>
              <el-checkbox v-model="component.checked">{{ component.name }}</el-checkbox>
            </div>
          </template>
        </vue-draggable-next>
      </div>
      <el-row type="flex" justify="center">
        <el-button type="primary" @click='onUpdate()'>閉じる</el-button>
        <!--
        <el-button @click='onClear()'>初期化</el-button>
        -->
      </el-row>
    </el-dialog>
  </div>
</template>

<style scoped>
ul {
  display: inline-block;
  margin: 0;
  padding: 0;
  margin-block-start: 0;
  margin-block-end: 0;
  padding-inline-start: 0;
}
li {
  display: inline-block;
  color: #000;
  padding: 0;
  margin: 0;
}
.ghost {
  opacity: 0.5;
  background: #999;
}
div.el-collapse-item__content {
  padding-bottom: 0;
}
div.el-collapse-item__header {
  height: 32px;
  line-height: 32px;
}

div.version {
  font-size: x-small;
  color: #999;
}
</style>
