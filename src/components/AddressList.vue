<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';
import { ElMessageBox } from 'element-plus';
import SeptCollapse from './SeptCollapse.vue';

interface Link {
  label: string,
  url: string,
  title: string,
  description: string,
  target: string,
}

interface Category {
  label: string,
  color: string,
  links: Link[],
  fold: boolean,
  openAll: boolean,
}

interface JsonToken {
  line: string,
  token: string,
}

const editMode = ref(false);
const showEditLink = ref(false);
const showEditCategory = ref(false);
const targetLink = ref<Link | null>(null);
const targetCategory = ref<Category | null>(null);
const targetJson = ref<string>('');
const addressBook = ref<Category[]>([]);

onMounted(() => {
  loadAddress();
});

const editLink = (l: Link) => {
    targetLink.value = l;
    showEditLink.value = true;
};

const addLink = (c: Category) => {
  const l = {
    label: '',
    url: '',
    title: '',
    description: '',
    target: '_blank'
  };
  targetLink.value = l;
  c.links.push(l);
  showEditLink.value = true;
};

const closeEdit = () => {
  showEditLink.value = false;
};

const deleteEdit = (targetLink: Link) => {
  ElMessageBox.confirm('本当に[' + targetLink.label + ']を削除しますか？', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
    addressBook.value.forEach((c: Category) => {
      const index = c.links.indexOf(targetLink)
      if (index >= 0) {
        c.links.splice(index, 1)
      }
    });
    updateTargetJsonAndSave();
    showEditLink.value = false;
  });
};

const editCategory = (c: Category) => {
  targetCategory.value = c;
  showEditCategory.value = true;
};

const addCategory = () => {
  const c = {
    label: '',
    color: '#fff',
    links: [],
    fold: false,
    openAll: false
  };
  targetCategory.value = c;
  addressBook.value.push(c);
  showEditCategory.value = true;
};

const closeEditCategory = () => {
  showEditCategory.value = false;
};

const deleteEditCategory = (targetCategory: Category) => {
  ElMessageBox.confirm('本当に[' + targetCategory.label + ']を削除しますか？', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
    const index = addressBook.value.indexOf(targetCategory);
    if (index >= 0) {
      addressBook.value.splice(index, 1);
    }
    updateTargetJsonAndSave();
    showEditCategory.value = false;
  });
};

const storeAddress = () => {
  targetJson.value = convJson(addressBook.value, true);
  if (window.localStorage) {
    window.localStorage.setItem('address', targetJson.value);
  }
};

const loadAddress = () => {
  if (window.localStorage) {
    const x = window.localStorage.getItem('address');
    targetJson.value = x ? x : '';
    if (targetJson.value) {
      addressBook.value = JSON.parse(targetJson.value);
      addressBook.value.forEach((c: Category) => {
        if (c.openAll === undefined) {
          c.openAll = false;
        }
      })
    }
  }
};

const updateJson = () => {
  addressBook.value = JSON.parse(targetJson.value);
  storeAddress();
};

const updateTargetJsonAndSave = () => {
  targetJson.value = convJson(addressBook.value, true);
  storeAddress();
};

const flipEditMode = () => {
  editMode.value = !editMode.value;
};

const convJson = (obj: Object, trimObj: boolean) => {
  let v = JSON.stringify(obj, undefined, '\t');
  if (trimObj) {
    const lines = v.split('\n');
    const vs = [] as string[];
    let ins = [] as JsonToken[];
    let inObj = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const token = line.trim();
      if (token.match(/".*": [^,]*,?[^{[]/)) {
        ins.push({ line: line, token: token });
      } else if (token == '{') {
        ins.push({ line: line, token: line });
        inObj = true;
      } else if (token == '}' || token == '},') {
        ins.push({ line: line, token: token });
        if (inObj) {
          const vs2 = [] as string[];
          ins.forEach((s) => vs2.push(s.token));
          vs.push(vs2.join(' '));
        } else {
          ins.forEach((s) => vs.push(s.line));
        }
        ins = [] as JsonToken[];
        inObj = false;
      } else {
        ins.forEach((s) => vs.push(s.line));
        ins = [] as JsonToken[];
        vs.push(line);
      }
    }
    v = vs.join('\n');
  }
  return v;
};

const foldAll = (b: boolean) => {
  addressBook.value.forEach((c: Category) => {
    c.fold = b;
  });
};

const openAll = (c: Category) => {
  for (let i = 0; i < c.links.length; i++) {
    const l = c.links[i];
    window.open(l.url, '_blank');
  }
};

</script>

<template>
  <div class="addressList">
    <sept-collapse title="ブックマーク" :isOpen="true" :showHeader="true" :state="true">
      <template #header>
        <el-button circle @click="foldAll(false)" size="small" title="すべて開く" class="foldButton"><el-icon><Plus/></el-icon></el-button>
        <el-button circle @click="foldAll(true)" size="small" title="すべて閉じる" class="foldButton"><el-icon><Minus/></el-icon></el-button>
        <el-button circle @click="flipEditMode()" :type="editMode ? 'success' : 'default'" size="small" title="編集モード"><el-icon><Setting/></el-icon></el-button>
      </template>
      <vue-draggable-next v-model="addressBook" :disabled="!editMode" :group="{name: 'addressBook'}" tag="ul" ghost-class="ghost" @change="updateTargetJsonAndSave()">
        <template v-for="(b, bi) in addressBook" :key="bi">
          <li class="category" :style="{ background: b.color, color: '#fff' }">
            <div class="categoryLabel">
              <transition name="editbutton">
                <template v-if="editMode"><el-icon><Grid/></el-icon></template>
                <template v-else>
                  <el-button v-if="b.fold" size="small" style="padding: 4px;" @click="b.fold = false"><el-icon><Plus/></el-icon></el-button>
                  <el-button v-else size="small" style="padding: 4px;" @click="b.fold = true"><el-icon><Minus/></el-icon></el-button>
                </template>
              </transition>
              {{b.label}}
              <transition name="editbutton">
                <template v-if="editMode">
                  <el-button size="small" style="padding: 4px;" @click="editCategory(b)"><el-icon><Edit/></el-icon></el-button>
                </template>
                <template v-else-if="b.openAll">
                  <el-button size="small" style="padding: 4px;" @click="openAll(b)" title="すべて開く"><img src="../assets/external-link.svg"/></el-button>
                </template>
              </transition>
            </div>
            <template v-if="!b.fold || editMode">
              <vue-draggable-next v-model="b.links" :disabled="!editMode" :group="{ name: b.links }" tag="ul" ghost-class="ghost" @change="updateTargetJsonAndSave()">
                <transition-group>
                  <template v-for="(l, lli) in b.links" :key="lli">
                    <li class="address">
                      <template v-if="editMode">
                        {{l.label}}
                      </template>
                      <template v-else>
                        <a :href="l.url" :title="l.title" :target="l.target">{{l.label}}</a>
                      </template>
                      <transition name="editbutton">
                        <el-button v-if="editMode" size="small" style="padding: 4px;" @click="editLink(l)"><el-icon><Edit/></el-icon></el-button>
                      </transition>
                    </li>
                  </template>
                </transition-group>
              </vue-draggable-next>
            </template>
            <transition name="editbutton">
              <el-button size="small" style="padding: 4px;" @click="addLink(b)" v-if="editMode"><el-icon><Plus/></el-icon></el-button>
            </transition>
          </li>
        </template>
      </vue-draggable-next>
      <transition name="editbutton">
        <el-button @click="addCategory()" v-if="editMode"><el-icon><Plus/></el-icon>カテゴリー追加</el-button>
      </transition>
      <sept-collapse title="JSONデータ" v-if="editMode" :showHeader="true" :state="false">
        <el-input type="textarea" v-model="targetJson" :rows="20"></el-input>
        <el-button @click="updateJson()">更新</el-button>
      </sept-collapse>
    </sept-collapse>
    <el-dialog title="ブックマーク編集" v-model="showEditLink" @close="storeAddress()">
      <template v-if="targetLink">
        <el-form label-width="6em">
          <el-form-item label="表示名">
            <el-input v-model="targetLink.label"/>
          </el-form-item>
          <el-form-item label="URL">
            <el-input v-model="targetLink.url"/>
          </el-form-item>
          <el-form-item label="タイトル">
            <el-input v-model="targetLink.title"/>
          </el-form-item>
          <el-form-item label="説明">
            <el-input v-model="targetLink.description"/>
          </el-form-item>
          <el-form-item label="ターゲット">
            <el-input v-model="targetLink.target"/>
          </el-form-item>
          <el-form-item>
            <el-button @click="closeEdit()" type="success">閉じる</el-button>
            <el-button @click="deleteEdit(targetLink)" type="danger">削除する</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>
    <el-dialog title="カテゴリ編集" v-model="showEditCategory" @close="storeAddress()">
      <template v-if="targetCategory">
        <el-form label-width="6em">
          <el-form-item label="表示名">
            <el-input v-model="targetCategory.label"/>
          </el-form-item>
          <el-form-item label="色">
            <el-color-picker v-model="targetCategory.color"/>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="targetCategory.openAll">まとめて開く</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button @click="closeEditCategory()" type="success">閉じる</el-button>
            <el-button @click="deleteEditCategory(targetCategory)" type="danger">削除する</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>
  </div>
</template>

<style>
li.category {
  display: inline-block;
  border-radius: 0.3em;
  padding: 0;
  margin: 0;
}
div.categoryLabel {
  display: inline-block;
  background: rgba(0,0,0,0.3);
  padding: 0.4em;
  border-radius: 0.4em;
  margin: 0.1em;
  line-height: 120%;
}
ul {
  display: inline-block;
  margin: 0;
  margin-block-start: 0;
  margin-block-end: 0;
  padding-inline-start: 0;
}
li.address {
  display: inline-block;
  color: #000;
  background: rgba(255,255,255,0.9);
  border: 1px solid #fff;
  border-radius: 0.4em;
  padding: 0.4em;
  margin: 0.1em;
  line-height: 100%;
}
li.address>a {
  text-decoration: none;
  color: #069;
}
li.address>a:hover {
  text-decoration: underline;
}
li.ghost {
  opacity: 0.5;
  background: #999;
}
button.editbutton-enter-active, button.editbutton-leave-active {
  transition: all 0.5s;
}
button.editbutton-enter, button.editbutton-leave-to {
  transform: scale(0);
}
div.foldButton {
  background: rgba(255,255,255,0.5);
}
</style>
