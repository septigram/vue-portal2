<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SeptCollapse from './SeptCollapse.vue';
import { VueDraggableNext } from 'vue-draggable-next';

const copyTexts = ref([
    { text: 'コピペメモ', wdays: [0,1,2,3,4,5,6] },
    { text: '今日は日曜日', wdays: [0] },
    { text: '今日は月曜日', wdays: [1] },
    { text: '今日は火曜日', wdays: [2] },
    { text: '今日は水曜日', wdays: [3] },
    { text: '今日は木曜日', wdays: [4] },
    { text: '今日は金曜日', wdays: [5] },
    { text: '今日は土曜日', wdays: [6] },
]);
const editMode = ref(false);
const jsonValue = ref('');

onMounted(() => {
    loadCopyText();
});

const onCopy = (text: string) => {
    navigator.clipboard.writeText(text);
};

const onAdd = () => {
    copyTexts.value.push({ text: '新規メモ', wdays: [0,1,2,3,4,5,6] });
    updateJson();
};

const onDelete = (target: any) => {
    const idx = copyTexts.value.indexOf(target);
    copyTexts.value.splice(idx, 1);
    updateJson();
}

const onFlipEditMode = () => {
    editMode.value = !editMode.value;
    if (editMode.value) {
        updateJson();
    } else {
        storeCopyText();
    }
};

const onUpdateJson = () => {
    try {
        const json = JSON.parse(jsonValue.value);
        copyTexts.value = json;
    } catch (e) {
        alert('JSON形式が不正です');
        updateJson();
        console.error(e);
    }
};

const trim = (text: string) => {
    return text != null && text.length > 10 ? (text.substring(0, 10) + '...') : text;
};

const checkWday = (wdays: number[]) => {
    const today = new Date();
    return wdays.includes(today.getDay());
};

const loadCopyText = () => {
    if (window.localStorage) {
        const json = window.localStorage.getItem('vue-portal1-copy');
        if (json) {
            copyTexts.value = JSON.parse(json);
            updateJson();
        }
    }
};

const storeCopyText = () => {
    if (window.localStorage) {
        window.localStorage.setItem('vue-portal1-copy', JSON.stringify(copyTexts.value));
    }
};

const updateJson = () => {
    jsonValue.value = JSON.stringify(copyTexts.value);
};

</script>

<template>
    <div class="copyPaste">
        <sept-collapse title="CopyAndPaste" :showHeader="true" :state="false">
            <template #header>
                <el-button circle @click="onFlipEditMode()" :type="editMode ? 'success' : 'default'" size="small" title="編集モード"><el-icon><Setting/></el-icon></el-button>
            </template>
            <template v-if="editMode">
                <vue-draggable-next v-model="copyTexts" :group="{name: 'copyTexts'}" tag="div" ghost-class="ghost" @change="updateJson()">
                    <template v-for="(ct, cti) in copyTexts">
                        <div class="editpane">
                            <el-icon><Grid/></el-icon>
                            <el-input type="textarea" v-model="ct.text" :rows="2" @change="updateJson()"/>
                            <el-checkbox-group v-model="ct.wdays" @change="updateJson()">
                                <el-checkbox label="0" :value="0">日</el-checkbox>
                                <el-checkbox label="1" :value="1">月</el-checkbox>
                                <el-checkbox label="2" :value="2">火</el-checkbox>
                                <el-checkbox label="3" :value="3">水</el-checkbox>
                                <el-checkbox label="4" :value="4">木</el-checkbox>
                                <el-checkbox label="5" :value="5">金</el-checkbox>
                                <el-checkbox label="6" :value="6">土</el-checkbox>
                            </el-checkbox-group>
                            <el-button icon="Delete" @click="onDelete(ct)"/>
                        </div>
                    </template>
                </vue-draggable-next>
                <el-button @click="onAdd" icon="Plus"/>

                <el-input type="textarea" v-model="jsonValue" :rows="2" @change="onUpdateJson"/>
            </template>
            <template v-else>
                <template v-for="ct in copyTexts">
                    <div v-if="checkWday(ct.wdays)">
                        {{ trim(ct.text) }}
                        <el-button @click="onCopy(ct.text)" icon="CopyDocument" size="small"/>
                    </div>
                </template>
            </template>
        </sept-collapse>
    </div>
</template>

<style scoped>
div.editpane {
    margin: 1px;
    border: 1px solid #ccc;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
div.ghost {
  opacity: 0.5;
  background: #999;
}
</style>