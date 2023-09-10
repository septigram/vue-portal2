<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SeptCollapse from './SeptCollapse.vue';

const memo = ref('');

onMounted(() => { loadMemo(); });

const loadMemo = () => {
  if (window.localStorage) {
    const memoValue = window.localStorage.getItem('memo');
    if (memoValue) {
      memo.value = memoValue;
    }
  }
}

const storeMemo = () => {
  if (window.localStorage) {
    window.localStorage.setItem('memo', memo.value);
  }
};

</script>
  
<template>
  <div class="memo">
    <sept-collapse title="ちょいメモ" :showHeader="true" :state="false">
      <el-input type="textarea" :row='10' v-model="memo" @change="storeMemo()"/>
    </sept-collapse>
  </div>
</template>

<style scoped>

</style>