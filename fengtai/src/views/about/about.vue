<script setup>
import { ref } from 'vue'

const info = ref('这是 About 页面，用于展示项目信息。')
</script>

<template>
  <div class="about">
    <h1>About</h1>
    <p>{{ info }}</p>
    <router-link to="/" class="link-btn">返回首页</router-link>
  </div>
</template>

<style scoped>
.about {
  padding: 24px;
}

h1 {
  margin: 0 0 8px;
  font-size: 24px;
}

.link-btn {
  display: inline-block;
  margin-top: 12px;
  padding: 8px 12px;
  background: #67c23a;
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
}

.link-btn:hover {
  background: #529b2e;
}
</style>