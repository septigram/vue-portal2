<script setup lang="ts">
import { ref } from 'vue';
import SeptCollapse from './SeptCollapse.vue';

interface TokenInfo {
  line: string,
  token: string,
};

const showTools = ref([]);
const baseJson = ref('');
const fmtJson = ref('');
const trimObj = ref(true);

const jsonExpand = () => {
  const obj = JSON.parse(baseJson.value);
  fmtJson.value = convJson(obj);
};

const jsonComplex = () => {
  const obj = JSON.parse(fmtJson.value);
  baseJson.value = JSON.stringify(obj);
};

const jsonBaseClear = () => {
  baseJson.value = '';
};

const jsonFmtClear = () => {
  fmtJson.value = '';
};

const convJson = (obj: any) => {
  let v = JSON.stringify(obj, undefined, '\t');
  if (trimObj.value) {
    const lines = v.split('\n');
    const vs = [] as string[];
    let ins = [] as TokenInfo[];
    let inObj = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const token = line.trim();
      if (token.match(/".*": [^,]*,?[^{[]/)) {
        ins.push({ line: line, token: token });
      } else if (token == '{') {
        ins.push({ line: line, token: line });
        inObj = true;
      } else if (token == '}' || token == '},') {
        ins.push({ line: line, token: token });
        if (inObj) {
          const vs2 = [] as string[];
          if (vs.length > 0 && vs[vs.length - 1].endsWith('{')) {
            const x = vs.splice(vs.length - 1, 1);
            vs2.push(x[0]);
          }
          ins.forEach((s) => vs2.push(s.token));
          vs.push(vs2.join(' '));
        } else {
          ins.forEach((s) => vs.push(s.line));
        }
        ins = [];
        inObj = false;
      } else {
        ins.forEach((s) => vs.push(s.line));
        ins = [] as TokenInfo[];
        vs.push(line);
      }
    }
    v = vs.join('\n');
  }
  return v;
};

</script>
  
<template>
  <div class="jsonTool">
    <sept-collapse title="JSONツール" :showHeader="true" :state="false">
      ■整形前 行数：{{ baseJson.split('\n').length }}<br/>
      <el-input type="textarea" :rows="20" v-model="baseJson"/><br/>
      <el-button @click="jsonExpand()"><el-icon><ArrowDown/></el-icon>展開</el-button>
      <el-button @click="jsonComplex()"><el-icon><ArrowUp/></el-icon>縮小</el-button>
      <el-button @click="jsonBaseClear()">↑クリア</el-button>
      <el-button @click="jsonFmtClear()">↓クリア</el-button>
      <el-checkbox v-model="trimObj">trim</el-checkbox><br/>
      ■整形後 行数：{{ fmtJson.split('\n').length }}<br/>
      <el-input type="textarea" :rows="20" v-model="fmtJson"/><br/>
    </sept-collapse>
  </div>
</template>

<style scoped>

</style>