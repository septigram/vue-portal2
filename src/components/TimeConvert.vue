<script setup lang="ts">
import { ref } from 'vue';
import SeptCollapse from './SeptCollapse.vue';

const codeInput = ref('');
const codeOutput = ref('');

const convTime1 = () => {
  codeOutput.value = new Date(parseInt(codeInput.value)).toString();
};

const convTime2 = () => {
  codeOutput.value = new Date(codeInput.value).getTime().toString();
}

</script>
  
<template>
  <div class="timeConvert">
    <sept-collapse title="時間変換" :showHeader="true" :state="false">
      <button @click="convTime1()">UNIX時間→時刻</button>
      <button @click="convTime2()">時刻→UNIX時間</button><br/>
      IN:<input v-model='codeInput'/><br/>
      OUT:<input v-model='codeOutput' readonly style="background:#eee;border:1px solid gray;"/>
    </sept-collapse>
  </div>
</template>

<style scoped>

</style>