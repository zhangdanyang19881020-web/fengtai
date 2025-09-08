<template>
  <div style="height:700px">
    <FamilyNode :root="data" @select="onSelect"/>
  </div>
</template>

<script>
import { ref } from 'vue'
import FamilyNode from '@/components/FamilyNode.vue'

export default {
  components: { FamilyNode },
  setup() {
    const data = ref({
      id: 'root',
      name: '张三',
      spouse: '李四',
      children: [
        { id: 'a', name: '张大', children: [{ id:'a-1', name:'张小大' }] },
        { id: 'b', name: '张二' }
      ]
    })
    const onSelect = (node) => console.log('选中:', node)
    return { data, onSelect }
  }
}
</script>
