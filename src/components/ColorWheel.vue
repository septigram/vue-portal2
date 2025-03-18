<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SeptCollapse from './SeptCollapse.vue';

interface ColorMap {
  name: string,
  reverse: boolean,
  mapping: number[],
};

interface Hsl {
  hue: number,
  satuation: number,
  luminance: number,
};

interface Rgbs {
  rgb: string,
  rgb2: string,
};

const showTool = ref(false);
const huristicHue = ref(false);
const value = ref('#000000');
const hue = ref(0);
const satuation = ref(100);
const luminance = ref(50);
const hsl = ref('#000000');
const splits = ref(5);
const degree = ref(160);
const cols = ref([] as Rgbs[]);
const canvas1 = ref(null as HTMLCanvasElement | null);

let colorMap = null as ColorMap | null;
const colorMaps = [
  {
    name: 'Itten',
    reverse: true,
    mapping: [
      354, 329, 278, 226, 206, 199, 143, 80, 56, 34, 15, 2
    ]
  },
  {
    name: 'Itten2',
    reverse: false,
    mapping: [
      //354, 329, 278, 226, 206, 199, 143, 80, 56, 34, 15, 2
      354, 2, 15, 34, 56, 80, 143, 199, 206, 226, 278, 329
    ]
  },
  {
    name: 'PCCS',
    reverse: false,
    mapping: [
      351, 17, 37, 50, 66, 154, 175, 192, 208, 243, 294, 332
    ]
  },
  {
    name: 'Original',
    reverse: false,
    mapping: [
      0, 30, 50, 60, 70, 100, 120, 180, 190, 220, 280, 300
    ]
  }
] as ColorMap[];

onMounted(() => {
  colorMap = colorMaps[3];
  draw();
});

const flipTool = () => {
  showTool.value = !showTool.value;
  redraw();
};

const setValue = () => {
  let hsl = null as null | Hsl;
  if (value.value.match(/#[0-9a-fA-F]{6}/)) {
    const r = parseInt(value.value.substring(1, 3), 16);
    const g = parseInt(value.value.substring(3, 5), 16);
    const b = parseInt(value.value.substring(5, 7), 16);
    hsl = rgbToHsl(r, g, b);
  } else if (value.value.match(/#[0-9a-fA-F]{3}/)) {
    let r = parseInt(value.value.substring(1, 2), 16);
    let g = parseInt(value.value.substring(2, 3), 16);
    let b = parseInt(value.value.substring(3, 4), 16);
    r *= 0x11;
    g *= 0x11;
    b *= 0x11;
    hsl = rgbToHsl(r, g, b);
  }
  if (hsl !== null) {
    hue.value = hsl.hue;
    satuation.value = hsl.satuation;
    luminance.value = hsl.luminance;
    redraw();
  }
};

const setHue = (e: MouseEvent) => {
  const cx = 60;
  const cy = 60;
  const th = Math.atan2(e.offsetY - cy, e.offsetX - cx);
  hue.value = (th / 2 / Math.PI * 360 + 360) % 360;
  redraw();
};

const redraw = () => {
  colorMap = huristicHue.value ? colorMaps[3] : null;
  draw();
};

const draw = () => {
  if (!canvas1.value) {
    return;
  }
  const g = canvas1.value.getContext('2d');
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
  g.arc(cx, cy, r, 0, 2 * Math.PI, false);
  g.arc(cx, cy, r - 30, 0, 2 * Math.PI, false);
  g.stroke();
  const steps = 360;
  for (let i = 0; i < steps; i++) {
    const ihue = Math.floor(360 * i / steps);
    const th = i / steps * 2 * Math.PI;
    const thd = 2 * Math.PI / steps * 2;
    g.fillStyle = 'hsl(' + angleToHue(colorMap, ihue) + ',' + Math.floor(satuation.value) + '%,' + Math.floor(luminance.value) + '%)';
    fillArc(g, th, thd, cx, cy, r, r - 30);
  }
  if (showTool.value) {
    g.strokeStyle = luminance.value > 50 ? '#666' : '#ccc';
    g.lineWidth = 2;
    cols.value.splice(0, cols.value.length);
    for (let s = 0; s < splits.value; s++) {
      g.beginPath()
      const si = s - (splits.value - 1) / 2;
      const hh = Math.floor(hue.value + degree.value / splits.value * si) % 360;
      const thh = hh / 360 * 2 * Math.PI;
      const hx = cx + Math.cos(thh) * (r - 15);
      const hy = cy + Math.sin(thh) * (r - 15);
      g.arc(hx, hy, 6, 0, 2 * Math.PI, false);
      g.stroke();
      const rgb = hslToRgb(angleToHue(colorMap, hh), satuation.value, luminance.value);
      const rgb2 = '#' + rgb.substring(1, 2) + rgb.substring(3, 4) + rgb.substring(5, 6);
      cols.value.push({ rgb: rgb, rgb2: rgb2 });
    }
  }
  g.beginPath();
  g.strokeStyle = luminance.value > 50 ? '#333' : '#eee';
  g.lineWidth = 2;
  const thh = hue.value / 360 * 2 * Math.PI;
  const hx = cx + Math.cos(thh) * (r - 15);
  const hy = cy + Math.sin(thh) * (r - 15);
  g.arc(hx, hy, 10, 0, 2 * Math.PI, false);
  g.stroke();
  hsl.value = 'hsl(' + Math.floor(hue.value) + ',' + Math.floor(satuation.value) + '%,' + Math.floor(luminance.value) + '%)';
  value.value = hslToRgb(hue.value, satuation.value, luminance.value);
};

const fillArc = (g: CanvasRenderingContext2D, th: number, thd: number, cx: number, cy: number, r1: number, r2: number) => {
  const thx0 = Math.cos(th);
  const thy0 = Math.sin(th);
  const thx1 = Math.cos(th + thd);
  const thy1 = Math.sin(th + thd);
  const x0 = cx + thx0 * r1;
  const y0 = cy + thy0 * r1;
  const x1 = cx + thx0 * r2;
  const y1 = cy + thy0 * r2;
  const x2 = cx + thx1 * r1;
  const y2 = cy + thy1 * r1;
  const x3 = cx + thx1 * r2;
  const y3 = cy + thy1 * r2;
  g.beginPath();
  g.moveTo(x0, y0);
  g.lineTo(x1, y1);
  g.lineTo(x3, y3);
  g.lineTo(x2, y2);
  g.closePath();
  g.fill();
};

const rgbToHsl = (red: number, green: number, blue: number): Hsl => {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  let cmax = Math.max(r, g, b);
  let cmin = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = 0;
  const hsl = { hue: 0, satuation: 0, luminance: 0 } as Hsl;
  l = (cmax + cmin) / 2;
  hsl.luminance = Math.floor(l * 100);
  const cd = cmax - cmin;
  if (cd === 0) {
    return hsl;
  }
  if (l < 0.5) {
    s = cd / (cmax + cmin);
  } else {
    s = cd / (2 - (cmax + cmin));
  }
  hsl.satuation = Math.floor(s * 100);
  if (r === cmax) {
    h = (g - b) / cd;
  } else if (g === cmax) {
    h = 2 + (b - r) / cd;
  } else if (b == cmax) {
    h = 4 + (r - g) / cd;
  }
  h = Math.floor(h * 60 + 360) % 360;
  hsl.hue = h;
  return hsl;
};

const hslToRgb = (hue: number, satuation: number, luminance: number) => {
  const h = (hue + 360) % 360;
  const s = satuation / 100;
  const l = luminance / 100;
  let cmin, cmax;
  if (l <= 0.5) {
    cmin = l * (1 - s);
    cmax = 2 * l - cmin;
  } else {
    cmax = l * (1 - s) + s;
    cmin = 2 * l - cmax;
  }
  const r = Math.floor(h2v((h + 120) % 360, cmin, cmax) * 255).toString(16);
  const g = Math.floor(h2v(h, cmin, cmax) * 255).toString(16);
  const b = Math.floor(h2v((h + 240) % 360, cmin, cmax) * 255).toString(16);
  return '#' + ('0' + r).slice(-2) + ('0' + g).slice(-2) + ('0' + b).slice(-2);
};

const h2v = (h: number, cmin: number, cmax: number) => {
  if (h < 60) {
    return cmin + (cmax - cmin) * h / 60;
  }
  if (h < 180) {
    return cmax;
  }
  if (h < 240) {
    return cmin + (cmax - cmin) * (240 - h) / 60;
  }
  return cmin;
};

const angleToHue = (colorMap: ColorMap | null, angle: number) => {
  if (!colorMap) {
    return angle;
  }
  const mapping = colorMap.mapping;
  const n1 = ((angle + 360) % 360) / (360 / mapping.length);
  const n2 = Math.floor(n1);
  const m1 = mapping[n2];
  const m2 = mapping[(n2 + 1) % mapping.length];
  const d = m1 < m2 ? m2 - m1 : m2 + 360 - m1;
  const c = Math.floor(m1 + (n1 - n2) * d);
  return (c + 360) % 360;
};

</script>


<template>
  <div class="colorWheel">
    <sept-collapse title="カラーホイール" :showHeader="true" :state="false">
      <div class="vBarBox">
        <canvas ref="canvas1" width="120" height="120" @click="setHue"/><br/>
        <el-checkbox v-model="huristicHue" label="知覚的色相" @change="redraw()"/>
      </div>
      <div class="vBarBox">
        彩度<br/>
        <el-slider v-model="satuation" :max='100' @change="redraw()" vertical height="100px" style="margin: 10px 0 0 0;display: inline-block;"/>
      </div>
      <div class="vBarBox">
        明度<br/>
        <el-slider v-model="luminance" :max='100' @change="redraw()" vertical height="100px" style="margin: 10px 0 0 0;display: inline-block;"/>
      </div>
      <div style="display: inline-block;">
        <div class="disp" :style="{ background: value }"></div>
        <div class="disp" :style="{ background: hsl }"></div><br/>
        <el-input v-model="value" @change="setValue" style="width: 6em;"/><br/>
        <span style="font-family: monospace;font-size:small;">{{hsl}}</span><br/>
        <el-button ref="toolButton" size="small" @click="flipTool" :type="showTool ? 'success' : 'default'">分割</el-button>
      </div>
      <template v-if="showTool">
        <el-form label-width="4em">
          <el-form-item label="分割数">
            <el-slider v-model="splits" :min="1" :max="24" @change="redraw()"/>
          </el-form-item>
          <el-form-item label="分散">
            <el-slider v-model="degree" :min="0" :max="360" @change="redraw()"/>
          </el-form-item>
          <template v-for="(col, ci) in cols" :key="ci">
            <div class="disp2Box">
              {{ci + 1}}:
              <div class="disp2" :style="{ background: col.rgb }"></div>
              {{ col.rgb }}
              <div class="disp2" :style="{ background: col.rgb2 }"></div>
              {{ col.rgb2 }}
            </div>
          </template>
        </el-form>
      </template>
    </sept-collapse>
  </div>
</template>

<style scoped>
div.disp {
  display: inline-block;
  position: relative;
  left: 12px;
  width: 32px;
  height: 48px;
}
div.disp2Box {
  font-family: monospace;
  margin: 0 0 0 2em;
}
div.disp2 {
  display: inline-block;
  width: 1em;
  height: 1em;
}
div.vBarBox {
  display: inline-block;
  vertical-align: top;
  text-align: center;
}
</style>
