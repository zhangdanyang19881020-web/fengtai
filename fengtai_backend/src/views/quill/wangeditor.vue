<template>
  <div style="border: 1px solid #ccc">
    <Toolbar :editor="editorRef" style="border-bottom: 1px solid #ccc" />
    <Editor
      v-model="html"
      :default-config="editorConfig"
      style="height: 400px; overflow-y: auto;"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from "vue"
import { Editor, Toolbar } from "@wangeditor/editor-for-vue"
import "@wangeditor/editor/dist/css/style.css"

const html = ref("<p>请输入内容...</p>")
const editorRef = ref(null)

// 配置
const editorConfig = {
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadImage: {
      async customUpload(file, insertFn) {
        // 上传逻辑，这里只是演示
        const url = URL.createObjectURL(file)
        insertFn(url, file.name, url)
      }
    }
  }
}

const handleCreated = (editor) => {
  editorRef.value = editor
}

onBeforeUnmount(() => {
  if (editorRef.value) editorRef.value.destroy()
})
</script>
