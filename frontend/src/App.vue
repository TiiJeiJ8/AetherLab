<template>
  <div class="app-root">
    <div class="min-vh-100 bg-color position-relative">
      <router-view />
    </div>
    <ThemeButton @change="handleThemeChange" />
  </div>
</template>

<script>
/* eslint-disable */
import ThemeButton from './components/Common/ThemeButton.vue'

export default {
  name: 'App',
  components: {
    ThemeButton
  },
  methods: {
    handleThemeChange(theme) {
      // 当主题变化时，发送全局事件
      this.$emit('global-theme-change', theme === 'dark' ? 'dark' : 'default')
      
      // 也可以通过事件总线或其他方式通知其他组件
      window.dispatchEvent(new CustomEvent('app-theme-change', {
        detail: { colorScheme: theme === 'dark' ? 'dark' : 'default' }
      }))
    }
  }
}
</script>

<style>
@import url('./assets/CSS/bootstrap.min.css');
@import './assets/CSS/btn.css';
@import './assets/CSS/index_style.css';
@import './assets/CSS/construction_style.css';
@import './assets/CSS/variables.css';

:root {
  --z-index-content: 1;
  --z-index-theme-button: 1000;
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
  transition: background-color 1.3s, color 1.3s;
}

a {
  color: var(--primary-color);
}
</style>
