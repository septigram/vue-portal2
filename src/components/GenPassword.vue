<script setup lang="ts">
import { ref } from 'vue';
import SeptCollapse from './SeptCollapse.vue';

const passwd = ref('');

const alphaLower = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ];
const alphaUpper = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
const numbers = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ];
const symbols = [ '!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~' ];
const readables = [ '2', '3', '4', '5', '6', '7', '8', '9', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'X', 'C', 'V', 'B', 'N', 'M' ];
const alphaLowerFlag = ref(true);
const alphaUpperFlag = ref(true);
const numbersFlag = ref(true);
const symbolsFlag = ref(false);
const distinctivenessFlag = ref(false);
const passwdLength = ref('16');

const genPasswd = () => {
  const len = parseInt(passwdLength.value);
  if (isNaN(len)) {
    passwd.value = ('');
    return;
  }
  const vs = [] as string[];
  let candidates = [] as string[];
  if (distinctivenessFlag.value) {
    candidates = candidates.concat(readables);
    vs.push(getRandomChar(readables));
  } else {
    if (alphaLowerFlag.value) {
      candidates = candidates.concat(alphaLower);
      vs.push(getRandomChar(alphaLower));
    }
    if (alphaUpperFlag.value) {
      candidates = candidates.concat(alphaUpper);
      vs.push(getRandomChar(alphaUpper));
    }
    if (numbersFlag.value) {
      candidates = candidates.concat(numbers);
      vs.push(getRandomChar(numbers));
    }
    if (symbolsFlag.value) {
      candidates = candidates.concat(symbols);
      vs.push(getRandomChar(symbols));
    }
  }
  if (vs.length > len) {
    vs.splice(0, vs.length - len);
  }
  for (let i = vs.length; i < len; i++) {
    vs.push(getRandomChar(candidates));
  }
  for (let i = 0; i < vs.length; i++) {
    const r = Math.floor(Math.random() * vs.length);
    const t = vs[i];
    vs[i] = vs[r];
    vs[r] = t;
  }
  passwd.value = vs.join('');
};

const getRandomChar = (vs: string[]) => {
  return vs[Math.floor(Math.random() * vs.length)];
};

const execCopy = (v: string) => {
  const tmp = document.createElement('div');
  const pre = document.createElement('pre');
  pre.style.webkitUserSelect = 'auto';
  pre.style.userSelect = 'auto';
  tmp.appendChild(pre).textContent = v;
  const s = tmp.style;
  s.position = 'fixed';
  s.right = '200%';
  document.body.appendChild(tmp);
  const sel = document.getSelection();
  if (sel) {
    sel.selectAllChildren(tmp);
  }
  const result = document.execCommand('copy');
  document.body.removeChild(tmp);
  return result;
};

</script>

<template>
  <div class="genpass">
    <sept-collapse title="パスワード生成" :showHeader="true" :state="false">
      <el-input v-model="passwd" style="width: 18em;"/>
      <el-button @click="execCopy(passwd)"><el-icon><DocumentCopy/></el-icon></el-button>
      <br/>
      <div class="a">
        <el-checkbox v-model="alphaUpperFlag" :disabled="distinctivenessFlag">A</el-checkbox>
      </div>
      <div class="a">
        <el-checkbox v-model="alphaLowerFlag" :disabled="distinctivenessFlag">a</el-checkbox>
      </div>
      <div class="a">
        <el-checkbox v-model="numbersFlag" :disabled="distinctivenessFlag">1</el-checkbox>
      </div>
      <div class="a">
        <el-checkbox v-model="symbolsFlag" :disabled="distinctivenessFlag">@</el-checkbox>
      </div>
      <br/>
      <div class="b">
        <el-checkbox v-model="distinctivenessFlag">高識別性</el-checkbox>
      </div>
      長さ：
      <div class="a">
        <el-input v-model="passwdLength" max-length="3" size="small"/>
      </div>
      <div class="a">
        <el-button @click="genPasswd" :autosize="true" size="small" type="primary">生成</el-button>
      </div>
    </sept-collapse>
  </div>
</template>

<style scoped>
div.a {
  display: inline-block;
  width: 4em;
}
div.b {
  display: inline-block;
}
</style>