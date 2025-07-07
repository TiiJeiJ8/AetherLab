<template>
  <div class="app-root">
    <div class="min-vh-100 bg-color position-relative">
      <router-view></router-view>
    </div>
    <ThemeButton />
  </div>
</template>

<script>
import ThemeButton from '@/components/ThemeButton.vue'

export default {
  name: 'App',
  components: {
    ThemeButton
  }
}
</script>

<style>
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css');
@import './assets/CSS/btn.css';
@import './assets/CSS/index_style.css';
@import './assets/CSS/construction_style.css';

:root {
  --z-index-content: 1;
  --z-index-theme-button: 1000;
  /* 默认light主题颜色 */
  --bg-color: #f8f9fa;
  --text-color: #333333;
  --primary-color: #5a81b4;
}

[data-theme="dark"] {
  /* dark主题颜色 */
  --bg-color: #212121;
  --text-color: #dcd6d6;
  --primary-color: #3a506b;
}

.min-vh-100 {
  position: relative;
  z-index: var(--z-index-content);
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

/* 全局主题样式 */
body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

a {
  color: var(--primary-color);
}
</style>
