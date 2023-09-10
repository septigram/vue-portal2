<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SeptCollapse from './SeptCollapse.vue';

const now = ref(new Date());
const time1 = ref('');
const time2 = ref('');
const clock1 = ref(null as HTMLCanvasElement | null);

onMounted(() => {
  tick();
  setInterval(function () { tick() }, 1000);
})

const tick = () => {
  now.value = new Date();
  draw();
};

const draw = () => {
  if (!clock1.value) {
    return;
  }
  const g = clock1.value.getContext('2d');
  if (!g) {
    return;
  }
  g.fillStyle = '#fff';
  g.rect(0, 0, 120, 120);
  g.fill();
  const cx = 60;
  const cy = 60;
  const r = cx - 4;
  g.strokeStyle = '#000';
  g.lineWidth = 2;
  g.lineCap = 'butt';
  g.beginPath();
  g.arc(cx, cy, r, 0, Math.PI * 2, false);
  g.stroke();
  g.beginPath();
  g.lineWidth = 3;
  for (let i = 0; i < 60; i++) {
    const th = i * 2 * Math.PI / 60;
    drawHand(g, th, cx, cy, i % 5 === 0 ? 48 : 51, 54);
  }
  g.stroke();
  const h = now.value.getHours();
  const m = now.value.getMinutes();
  const s = now.value.getSeconds();
  time1.value = fmtTime(m >= 20 && m <= 40 ? null : now.value);
  time2.value = fmtTime(m >= 20 && m <= 40 ? now.value : null);
  const vs = [
    { th: (h + m / 60 - 3) * 2 * Math.PI / 12, lineWidth: 6, color: '#000', r1: 30, r2: -5 },
    { th: (m - 15) * 2 * Math.PI / 60, lineWidth: 4, color: '#000', r1: m % 5 === 0 ? 47 : 50, r2: -5 },
    { th: (s - 15) * 2 * Math.PI / 60, lineWidth: 2, color: '#09c', r1: s % 5 === 0 ? 44 : 47, r2: -5, r3: 3 },
  ]
  vs.forEach((v) => {
    g.lineWidth = v.lineWidth;
    g.strokeStyle = v.color;
    g.beginPath();
    drawHand(g, v.th, cx, cy, v.r1, v.r2);
    g.stroke();
    if (v.r3) {
      g.beginPath();
      g.fillStyle = v.color;
      g.arc(cx + Math.cos(v.th) * v.r1, cy + Math.sin(v.th) * v.r1, v.r3, 0, 2 * Math.PI, false);
      g.fill();
    }
  });
};

const drawHand = (g: CanvasRenderingContext2D, th: number, cx: number, cy: number, r1: number, r2: number) => {
  const thx = Math.cos(th);
  const thy = Math.sin(th);
  const x0 = cx + thx * r1;
  const y0 = cy + thy * r1;
  const x1 = cx + thx * r2;
  const y1 = cy + thy * r2;
  g.moveTo(x0, y0);
  g.lineTo(x1, y1);
};

const fmtTime = (d: Date | null): string => {
  if (d === null) {
    return '';
  }
  const h = d.getHours();
  const m = d.getMinutes();
  const s = d.getSeconds();
  return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
};

</script>

<template>
  <div class="analogClock">
    <sept-collapse title="時計" :isOpen="true" :showHeader='false' :state="true">
      <canvas ref="clock1" width="120" height="120"/><br/>
      <div class="disp1">{{time1}}</div>
      <div class="disp2">{{time2}}</div>
    </sept-collapse>
  </div>
</template>

<style scoped>
div.disp1, div.disp2 {
  position: relative;
  height: 1.5em;
  width: 120px;
  text-align: center;
  font-size: x-small;
  font-weight: bold;
}
div.disp1 {
  top: -4em;
  height: 0;
}
div.disp2 {
  top: -11em;
  height: 0;
}
</style>
