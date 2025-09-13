<template>
  <el-drawer
    custom-class="people-drawer"
    size="90%"
    v-model="innerShow"
    :direction="direction"
  >
    <template #header>
      <h4>搜索地址</h4>
    </template>

    <template #default>
      <div class="people-list">
        <template v-if="Array.isArray(list) && list.length">
          <div class="people-item" v-for="(item, index) in list" :key="index">
            {{ item.name }}
          </div>
        </template>
        <div v-else>暂无数据</div>
      </div>
    </template>

    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, defineExpose } from 'vue'

const props = defineProps({
  // v-model:show
  show: { type: Boolean, default: false },
  // 搜索结果列表
  list: { type: Array, default: () => [] },
  // 抽屉方向
  direction: { type: String, default: 'btt' },
})

const emit = defineEmits(['update:show'])

// bridge prop <-> drawer's v-model
const innerShow = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val),
})

// actions
const cancelClick = () => {
  emit('update:show', false)
}
const confirmClick = () => {
  emit('update:show', false)
}

// optional helpers for parent .ref() usage
const open = () => emit('update:show', true)
const close = () => emit('update:show', false)

defineExpose({ open, close, cancelClick, confirmClick })
</script>

<style lang="scss" scoped>
/* el-drawer 自定义样式 */
::v-deep .people-drawer {
  width: 90%;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  overflow: hidden;
}

/* 列表容器样式 */
.people-list {
  padding: 16px;
  max-height: 60vh;
  overflow-y: auto;
}

/* 每个人员项的样式 */
.people-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
}

/* 没有找到人员时的样式 */
.people-list > div {
  font-size: 14px;
  color: #888;
  text-align: center;
}
</style>
