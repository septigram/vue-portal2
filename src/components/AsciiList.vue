<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SeptCollapse from './SeptCollapse.vue';

interface Col {
  col: number,
  code: number,
  hex: string,
  label: string,  
};

interface Row {
  row: number,
  label: string,
  cells: Col[],
};

const asciiText = ref('');
const codeTable = ref([] as Row[]);
const cols = ref([] as Col[]);
const labels = [
  'NUL', 'SOH', 'STX', 'ETX', 'EOT', 'ENQ', 'ACK', 'BEL',
  'BS', 'TAB', 'LF', 'VT', 'FF', 'CR', 'SO', 'SI',
  'DLE', 'DC1', 'DC2', 'DC3', 'DC4', 'NAK', 'SYN', 'ETB',
  'CAN', 'EM', 'SUB', 'ESC', 'FS', 'GS', 'RS', 'US',
  'SP',
] as string[];

onMounted(() => {
  const vs = [] as string[];
  for (let i = 0x20; i < 0x7f; i++) {
    const hex = i.toString(16);
    vs.push(decodeURIComponent('%' + hex));
  }
  asciiText.value = vs.join('');
  for (let x = 0; x < 16; x++) {
    cols.value.push({
      col: x,
      code: x,
      label: 'x' + x.toString(16),
      hex: '',
    });
  }
  for (let y = 0; y < 8; y++) {
    const row = {
      row: y,
      label: y.toString(16) + 'x',
      cells: [],
    } as Row;
    codeTable.value.push(row);
    for (let x = 0; x < 16; x++) {
      const n = y * 16 + x;
      const hex = n.toString(16);
      row.cells.push({
        col: x,
        code: n,
        hex: hex,
        label: n == 0x7f ? 'DEL' : (n <= 0x20 ? labels[n] : decodeURIComponent('%' + hex)),
      } as Col);
    }
  }
});

</script>

<template>
  <div class="ascii">
    <sept-collapse title="Asciiコード表" :showHeader="true" :state="false">
      <table>
        <tr>
          <th></th>
          <template v-for="(col, ci) in cols" :key="ci">
            <th>{{col.label}}</th>
          </template>
        </tr>
        <template v-for="(row, ri) in codeTable" :key="ri">
          <tr>
            <th>{{row.label}}</th>
            <template v-for="(cell, ci) in row.cells" :key="ci">
              <td :title="cell.hex" :class="{ 'small': cell.code <= 0x20 || cell.code == 0x7f }">{{cell.label}}</td>
            </template>
          </tr>
        </template>
      </table>
      0x20-0x7e<br/>
      <input v-model="asciiText"/><br/>
    </sept-collapse>
  </div>
</template>

<style scoped>
div.ascii table, div.ascii th, div.ascii td {
  border-collapse: collapse;
  border: 1px solid gray;
  text-align: center;
}
td.small {
  font-size: x-small;
  color: #999;
}
</style>
