<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import SeptCollapse from './SeptCollapse.vue';
import { backgroundColors, foregroundColors } from '../unicode-check/color';
import { limitText } from '../unicode-check/limit';
import { segment } from '../unicode-check/segment';
import { scriptOf } from '../unicode-check/script';
import { sjisCode } from '../unicode-check/sjis';
import { characterProperties, type PropertyLine } from '../unicode-check/properties';
import { unicodeNotation } from '../unicode-check/unicode-notation';

/** 結果表示の1符号位置。 */
interface CharView {
  text: string;
  script: string;
  color: string;
  background: string;
  unicode: string;
  sjis: string | null;
  properties: PropertyLine[];
}

type Row = { kind: 'break' } | ({ kind: 'char' } & CharView);

const source = ref('');

const rows = computed<Row[]>(() => {
  const tokens = segment(limitText(source.value));
  const scripts = tokens.flatMap((token) => (token.kind === 'char' ? [scriptOf(token.codePoint)] : []));
  const colors = foregroundColors(scripts);
  const backgrounds = backgroundColors(scripts);
  return tokens.map((token) => {
    if (token.kind === 'break') {
      return { kind: 'break' };
    }
    const script = scriptOf(token.codePoint);
    return {
      kind: 'char',
      text: String.fromCodePoint(token.codePoint),
      script,
      color: colors.get(script) ?? 'rgb(0, 0, 0)',
      background: backgrounds.get(script) ?? '#eee',
      unicode: unicodeNotation(token.codePoint),
      sjis: sjisCode(token.codePoint),
      properties: characterProperties(token.codePoint),
    };
  });
});

function categoryLine(view: CharView): PropertyLine | undefined {
  return view.properties.find((line) => line.name === 'category');
}

function flagLines(view: CharView): PropertyLine[] {
  return view.properties.filter((line) => line.name.startsWith('is'));
}

function flagLabel(name: string): string {
  return name.startsWith('is') ? name.slice(2) : name;
}

const hover = ref<{ view: CharView; left: number; top: number } | null>(null);
const detailEl = ref<HTMLElement | null>(null);

/** 符号位置の直下にホバー表示を出す。画面下へはみ出すときは上へずらす。 */
async function onEnter(event: PointerEvent, view: CharView) {
  const target = event.currentTarget;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const rect = target.getBoundingClientRect();
  hover.value = {
    view,
    left: rect.left,
    top: rect.bottom + 4,
  };
  await nextTick();
  const el = detailEl.value;
  if (!el || !hover.value) {
    return;
  }
  const maxTop = window.innerHeight - el.offsetHeight - 4;
  if (hover.value.top > maxTop) {
    hover.value = {
      view,
      left: rect.left,
      top: Math.max(4, maxTop),
    };
  }
}

function onLeave() {
  hover.value = null;
}

watch(source, () => {
  hover.value = null;
});

interface ScriptTally {
  script: string;
  count: number;
  color: string;
  background: string;
}

const tallies = computed<ScriptTally[]>(() => {
  const counts = new Map<string, ScriptTally>();
  for (const row of rows.value) {
    if (row.kind !== 'char') {
      continue;
    }
    const existing = counts.get(row.script);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(row.script, {
        script: row.script,
        count: 1,
        color: row.color,
        background: row.background,
      });
    }
  }
  return [...counts.values()];
});

const totalCount = computed(() => tallies.value.reduce((sum, item) => sum + item.count, 0));
</script>

<template>
  <div class="unicode-check">
    <SeptCollapse title="文字種の色分け" :showHeader="true" :state="false">
      <el-input
        v-model="source"
        type="textarea"
        :rows="8"
        placeholder="調べる文字列を貼り付けてください"
      />
      <div class="result">
        <template v-for="(row, index) in rows" :key="index">
          <br v-if="row.kind === 'break'" />
          <span
            v-else
            class="cp"
            :style="{ color: row.color, backgroundColor: row.background }"
            @pointerenter="onEnter($event, row)"
            @pointerleave="onLeave"
          >{{ row.text }}</span>
        </template>
      </div>
      <table class="script-counts">
        <tbody>
          <tr v-for="item in tallies" :key="item.script">
            <td :style="{ color: item.color, backgroundColor: item.background }">{{ item.script }}</td>
            <td class="count" :style="{ color: item.color, backgroundColor: item.background }">{{ item.count }}</td>
          </tr>
          <tr class="total">
            <td>total</td>
            <td class="count">{{ totalCount }}</td>
          </tr>
        </tbody>
      </table>
      <div
        v-if="hover"
        ref="detailEl"
        class="detail"
        :style="{ left: `${hover.left}px`, top: `${hover.top}px` }"
      >
        <p class="glyph">{{ hover.view.text }}</p>
        <p class="meta"><span class="label">文字種</span> {{ hover.view.script }} <span class="label">Unicode</span> {{ hover.view.unicode }}<template v-if="hover.view.sjis">{{ ' ' }}<span class="label">SJIS</span> {{ hover.view.sjis }}</template><template v-if="categoryLine(hover.view)">{{ ' ' }}<span class="label">category</span> {{ categoryLine(hover.view)?.value }}</template></p>
        <p class="flags">
          <template v-for="(line, index) in flagLines(hover.view)" :key="line.name">
            <span v-if="index > 0">{{ ' ' }}</span>
            <span class="flag" :class="{ 'flag-true': line.value === 'true' }">{{ flagLabel(line.name) }}</span>
          </template>
        </p>
      </div>
    </SeptCollapse>
  </div>
</template>

<style scoped>
.unicode-check {
  background: #fff;
  color: #000;
}

.unicode-check :deep(.el-textarea) {
  width: 36rem;
}

.result {
  white-space: pre-wrap;
  font-family: "Segoe UI", "Yu Gothic UI", sans-serif;
  font-size: 20px;
  line-height: 1.4;
  margin-top: 0.5rem;
}

.script-counts {
  margin-top: 0.75rem;
  border-collapse: collapse;
  font-family: "Segoe UI", "Yu Gothic UI", sans-serif;
  font-size: 14px;
}

.script-counts td {
  padding: 0.15rem 0.6rem;
  border: 1px solid #ccc;
}

.script-counts .count {
  text-align: right;
}

.script-counts .total td {
  color: #000;
  background: #fff;
}

.cp {
  display: inline-block;
  box-sizing: border-box;
  min-width: 0.5em;
  border: 1px dotted #cccccc;
  white-space: pre;
  text-align: center;
  vertical-align: bottom;
}

.detail {
  position: fixed;
  z-index: 20;
  pointer-events: none;
  padding: 0.5rem 0.75rem;
  background: #fff;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.15);
}

.glyph {
  font-family: "Segoe UI", "Yu Gothic UI", sans-serif;
  font-size: 64px;
  line-height: 1;
  margin: 0 0 0.25rem;
}

.detail p {
  margin: 0.15rem 0;
}

.meta {
  white-space: nowrap;
}

.label {
  color: #8888aa;
}

.flags {
  margin: 0.35rem 0 0;
  font-size: 13px;
  line-height: 1.35;
}

.flag {
  color: #999;
  font-weight: normal;
}

.flag-true {
  color: #000;
  font-weight: bold;
}
</style>
