<script setup lang="ts">
import { ref } from 'vue';
import SeptCollapse from './SeptCollapse.vue';

const inputValue = ref('0' as string | null);
const dispValue = ref('0');
let fraction = 0;
let denominator = 1;
let operator = null as string | null;

const input = (value: string) => {
  switch (value) {
  case '1':
  case '2':
  case '3':
  case '4':
  case '5':
  case '6':
  case '7':
  case '8':
  case '9':
    if (inputValue.value === null || inputValue.value === '0') {
      inputValue.value = '';
    }
    inputValue.value += value + '';
    break;
  case '0':
  case '00':
    if (inputValue.value !== '0') {
      if (inputValue.value === null) {
        inputValue.value = '';
      }
      inputValue.value += value + '';
    }
    break;
  case '.':
    if (inputValue.value === null) {
      inputValue.value = '';
    }
    inputValue.value += value + '';
    break;
  case '*':
  case '/':
  case '+':
  case '-':
    if (operator === null) {
      operator = '+';
    }
    calc();
    operator = value;
    break;
  case '=':
    calc();
    operator = null;
    break;
  case 'C':
    inputValue.value = '0';
    fraction = 0;
    denominator = 1;
    operator = null;
    break;
  case 'BS':
    if (inputValue.value != null && inputValue.value.length > 1) {
      inputValue.value = inputValue.value.substring(0, inputValue.value.length - 1);
    } else {
      inputValue.value = '0';
    }
    break;
  }
  dispValue.value = getDispValue();
};

const calc = () => {
  if (operator && inputValue.value) {
    const v2 = parseFloat(inputValue.value);
    switch (operator) {
    case '*':
      fraction *= v2;
      break;
    case '/':
      denominator *= v2;
      break;
    case '+':
      fraction += denominator * v2;
      break;
    case '-':
      fraction -= denominator * v2;
      break;
    }
    operator = null;
    inputValue.value = null;
  }
};

const getDispValue = () => {
  if (inputValue.value) {
    return inputValue.value;
  }
  let v = (fraction / denominator) + '';
  const dot = v.indexOf('.');
  if (dot >= 0 && v.length > 12) {
    return v.substring(0, 12);
  }
  return v
};

const toHex = (v: string): string => {
  const n = parseInt(v);
  if (n < 0) {
    return '-0x' + (-n).toString(16);
  }
  return '0x' + n.toString(16);
};

</script>

<template>
  <div class="calculatorTool">
    <sept-collapse title="電卓" :showHeader="true" :state="false">
      <div class="disp">
        {{dispValue}}<br/>
        <span style="font-size: small;">{{toHex(dispValue)}}</span>
      </div>
      <el-button @click="input('7')" size="small">7</el-button>
      <el-button @click="input('8')" size="small">8</el-button>
      <el-button @click="input('9')" size="small">9</el-button>
      <el-button @click="input('*')" size="small">*</el-button>
      <el-button @click="input('C')" size="small">C</el-button>
      <br/>
      <el-button @click="input('4')" size="small">4</el-button>
      <el-button @click="input('5')" size="small">5</el-button>
      <el-button @click="input('6')" size="small">6</el-button>
      <el-button @click="input('/')" size="small">/</el-button>
      <el-button @click="input('BS')" size="small">BS</el-button>
      <br/>
      <el-button @click="input('1')" size="small">1</el-button>
      <el-button @click="input('2')" size="small">2</el-button>
      <el-button @click="input('3')" size="small">3</el-button>
      <el-button @click="input('-')" size="small">-</el-button>
      <br/>
      <el-button @click="input('0')" size="small">0</el-button>
      <el-button @click="input('00')" size="small">00</el-button>
      <el-button @click="input('.')" size="small">.</el-button>
      <el-button @click="input('+')" size="small">+</el-button>
      <el-button @click="input('=')" size="small">=</el-button>
    </sept-collapse>
  </div>
</template>


<style scoped>
div.disp {
  border: 1px solid gray;
  border-radius: 0.2em;
  margin: 0.2em;
  padding: 0.3em;
  font-family: monospace;
  text-align: right;
  font-size: x-large;
  font-weight: bold;
  line-height: 100%;
}
button.el-button {
  padding: 0;
  margin: 0.1em;
  width: 1.5em;
  height: 1.2em;
  font-size: large;
}
</style>

