<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  showHeader: boolean,
  title: string,  
}>();
const title = ref<string>(props.title);
const showHeader = ref<boolean>(props.showHeader);
const state = ref<boolean>(true);

const onClick = () => {
  state.value = !state.value;
};

const setState = (b: boolean) => {
  state.value = b;
};

</script>

<template>
  <div class="septCollapse">
    <div v-if="showHeader" class="septCollapseHeader">
      <transition name="fade">
        <div v-if="state" class="septCollapseNavi">
          <slot name="header"/>
        </div>
      </transition>
      <div @click="onClick()" class="septCollapseTitle">
        <div :class="{ hicon: true, arrowRot: state}"><el-icon><ArrowRight/></el-icon></div>
        &nbsp;{{title}}
      </div>
      <br style="clear:both;"/>
    </div>
    <div :class="{septCollapseSlot: true, septCollapseSlotShow: state}">
      <slot/>
    </div>
  </div>
</template>

<style scoped>
div.septCollapse {
  border: 1px solid gray;
  border-radius: 0.5em;
  margin: 0.1em;
  padding: 0.1em;
  vertical-align: top;
  display: inline-block;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4)
}
div.septCollapseNavi {
  float:right;
}
div.septCollapseHeader {
  user-select: none;
  height: 2em;
}
div.septCollapseTitle {
  padding: 0.3em;
  cursor: pointer;
  display: inline-block;
}
div.hicon {
  display: inline-block;
  font-weight: bold;
  transition: transform 0.3s ease 0s;
}
div.arrowRot {
  transform: rotate(90deg);
}
div.septCollapseSlot {
  transition: max-width 1s ease 0s, max-height 1s ease 0s, ;
  max-height: 0;
  max-width: 0;
  overflow: hidden;
}
div.septCollapseSlotShow {
  max-height: 800px;
  max-width: 1024px;
  overflow: auto;
}
div.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
div.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
