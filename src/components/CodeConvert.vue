<script setup lang="ts">
import { ref } from 'vue';
import SeptCollapse from './SeptCollapse.vue';

const codeInput = ref('');
const codeOutput = ref('');

const convUtf8 = () => {
  codeOutput.value = encodeURIComponent(codeInput.value);
};

const convRevUtf8 = () => {
  codeOutput.value = decodeURIComponent(codeInput.value);
};
</script>

<template>
  <div class="codeConvert">
    <sept-collapse title="コード変換" :showHeader="true" :state="false">
      <button @click="convUtf8()">平文→URL</button>
      <button @click="convRevUtf8()">URL→平文</button><br/>
      IN:<input v-model='codeInput'/><br/>
      OUT:<input v-model='codeOutput' readonly style="background:#eee;border:1px solid gray;"/>
    </sept-collapse>
  </div>
</template>
