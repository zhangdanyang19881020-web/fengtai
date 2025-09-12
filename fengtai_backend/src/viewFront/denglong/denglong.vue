<template>
  <div class="lantern-container">
    <div class="lantern">
      <img src="./denglong.png" alt="Lantern" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Lantern',
};
</script>

<style scoped>
.lantern-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #222;
}

.lantern {
  width: 150px; /* 根据需要调整大小 */
  height: 150px; /* 根据需要调整大小 */
  display: flex;
  justify-content: center;
  align-items: center;
  animation: floatAndFade 6s ease-in-out infinite; /* 动画持续6秒，循环播放 */
}

.lantern img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 定义透明度从 0 到 100，再从 100 到 0 的升起动画 */
@keyframes floatAndFade {
  0% {
    transform: translateY(0);    /* 初始位置 */
    opacity: 0;                  /* 初始透明 */
  }
  25% {
    transform: translateY(-20px); /* 轻微上升 */
    opacity: 0.5;                 /* 透明度逐渐变为50% */
  }
  50% {
    transform: translateY(-40px); /* 升起一定高度 */
    opacity: 1;                   /* 完全不透明 */
  }
  75% {
    transform: translateY(-20px); /* 再次下降一点 */
    opacity: 0.5;                 /* 透明度降低到50% */
  }
  100% {
    transform: translateY(0);     /* 返回原始位置 */
    opacity: 0;                   /* 透明度恢复到0 */
  }
}
</style>
