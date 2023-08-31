<script setup lang="ts">
import { ref } from 'vue';
import SeptCollapse from './SeptCollapse.vue';

const tab = ref('s');
const isRegex = ref(false);
const keyword = ref('');
const source = ref('');
const result = ref('');

const updateResult = () => {
  if (!keyword.value) {
    return source.value;
  }
  const svs = source.value.split('\n');
  const vs = [] as string[];
  if (isRegex.value) {
    const reg = new RegExp(keyword.value);
    svs.forEach((line: string) => {
      if (reg.test(line))  {
        vs.push(line);
      }
    });
  } else {
    svs.forEach((line: string) => {
      if (line.indexOf(keyword.value) >= 0)  {
        vs.push(line);
      }
    });
  }
  result.value = vs.join('\n');
};

</script>
  
<template>
  <div class="grepTool">
    <sept-collapse title="GREPツール" :showHeader="true">
      <input v-model="keyword" @keyup="updateResult()"/>
      <el-checkbox v-model="isRegex" @change="updateResult()">正規表現</el-checkbox>
      <el-tabs v-model="tab">
        <el-tab-pane label="元データ" name="s">
          行数：{{source.split('\n').length}}
          <el-input type="textarea" :rows="20" v-model="source" placeholder="抽出対象データを貼り付けてください"/>
        </el-tab-pane>
        <el-tab-pane label="抽出結果" name="r">
          行数：{{result.split('\n').length}}
          <el-input type="textarea" :rows="20" v-model="result" :readonly='true'/>
        </el-tab-pane>
      </el-tabs>
    </sept-collapse>
  </div>
</template>

<style scoped>

</style>