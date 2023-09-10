<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SeptCollapse from './SeptCollapse.vue';

interface Store {
  openWhenNoCheck: boolean,
  checkTimes: string,
};

const store = ref<Store>({
  openWhenNoCheck: true,
  checkTimes: '',
});
const check1 = ref(null as typeof SeptCollapse | null);

onMounted(() => {
  loadChecks();
});

const checked = () => {
  if (store.value.checkTimes.length === 0) {
    return false;
  }
  const d = new Date();
  const ymd = d.getFullYear() + '/' + n2(d.getMonth() + 1) + '/' + n2(d.getDate());
  const lines = store.value.checkTimes.split('\n');
  const lymd = lines[0].substring(0, 10);
  return lymd >= ymd;
};

const n2 = (n: number): string => {
  return (n < 10 ? '0' : '') + n;
};

const onCheck = () => {
  const d = new Date()
  const ymdhm = d.getFullYear() + '/' + n2(d.getMonth() + 1) + '/' + n2(d.getDate()) + ' ' + n2(d.getHours()) + ':' + n2(d.getMinutes())
  store.value.checkTimes = ymdhm + '\n' + store.value.checkTimes;
  storeChecks();
  if (check1.value) {
    check1.value.setState(false);
  }
};

const storeChecks = () => {
  if (window.localStorage) {
    window.localStorage.setItem('checks', JSON.stringify(store.value));
  }
};

const loadChecks = () => {
  if (window.localStorage) {
    const json = window.localStorage.getItem('checks');
    if (json) {
      store.value = JSON.parse(json);
      if (store.value.openWhenNoCheck) {
        if (!checked() && check1.value) {
          check1.value.setState(true);
        }
      }
    }
  }
}
</script>

<template>
  <div class="checkToday">
    <sept-collapse title="毎日チェック" ref="check1" :isOpen="store.openWhenNoCheck && !checked()" :showHeader="true" :state="false">
      <div>
        <template v-if="checked()">
          <div class="checked">チェック済</div>
        </template>
        <template v-else>
          <el-button type="primary" @click="onCheck()">チェック</el-button>
        </template>
        &nbsp;
        <el-checkbox v-model="store.openWhenNoCheck" @change="storeChecks()"><span style="font-size:small;"> 未チェック時に開く</span></el-checkbox>
        <el-input type="textarea" :rows="5" v-model="store.checkTimes" @change="storeChecks()"/>
      </div>
    </sept-collapse>
  </div>
</template>

<style scoped>
div.checked {
  display: inline-block;
  border: 1px solid green;
  color: green;
  border-radius: 0.3em;
  background: #efe;
  padding: 0.5em 1em;
}
</style>
