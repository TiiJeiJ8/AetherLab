<!--todo Theme Btn-->
<template>
  <div
    id="g-btn"
    class="theme-button"
    :class="{ active: isActive }"
    @click="toggleTheme"
  ></div>
</template>

<script setup>
/* eslint-disable */
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: undefined
  },
  theme: {
    type: String,
    default: undefined // 'dark' | 'light' | undefined
  }
})
const emit = defineEmits(['update:modelValue', 'change'])

const isActive = ref(false)

// 外部受控优先
watch(() => props.modelValue, (val) => {
  if (typeof val === 'boolean') {
    isActive.value = val
    document.documentElement.setAttribute('data-theme', val ? 'dark' : 'light')
  }
})
watch(() => props.theme, (val) => {
  if (val === 'dark' || val === 'light') {
    isActive.value = val === 'dark'
    document.documentElement.setAttribute('data-theme', val)
  }
})

function toggleTheme() {
  isActive.value = !isActive.value
  const theme = isActive.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
  emit('update:modelValue', isActive.value)
  emit('change', theme)
}

onMounted(() => {
  // 优先受控，否则根据localStorage或html属性同步按钮状态
  if (props.modelValue === undefined && props.theme === undefined) {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isActive.value = savedTheme === 'dark'
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      isActive.value = document.documentElement.getAttribute('data-theme') === 'dark'
    }
  }
})
</script>

<style scoped>
.theme-button {
  /* Position */
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 220px;
  height: 90px;
  z-index: var(--z-index-theme-button);
  transform-origin: right bottom;
  transform: scale(1);
  transition: transform 0.3s ease;
  background:
          radial-gradient(circle at 18% 20px, #fff, #fff 6px, transparent 7px, transparent),
          radial-gradient(circle at 35% 45px, #fff, #fff 1px, transparent 2px, transparent),
          radial-gradient(circle at 10% 70px, #fff, #fff 2.5px, transparent 3.5px, transparent),
          radial-gradient(circle at 25% 15px, #fff, #fff 3px, transparent 4px, transparent),
          radial-gradient(circle at 15% 50px, #fff, #fff 1.5px, transparent 2.5px, transparent),
          radial-gradient(circle at 30% 75px, #fff, #fff 5px, transparent 6px, transparent),
          radial-gradient(circle at 5% 30px, #fff, #fff 0.5px, transparent 1.5px, transparent),
          radial-gradient(circle at 25% 60px, #fff, #fff 0.5px, transparent 1.5px, transparent),
          radial-gradient(circle at 7% 35px, #fff, #fff 0.5px, transparent 1.5px, transparent),
          linear-gradient(90deg, #2b303e, #2b303e 50%, #5a81b4 50%, #5a81b4);
  background-repeat: no-repeat;
  background-size: 200% 100%;
  background-position: 100% 0;
  border-radius: 90px;
  box-shadow:
      0 -3px 4px #999,
      inset 0 3px 5px #333,
      0 4px 4px #ffe,
      inset 0 -3px 5px #ddd;
  cursor: pointer;
  overflow: hidden;
  transition: .5s all;
}

@media (max-width: 2560px) {
  .theme-button {
    transform: scale(0.35);
    position: fixed;
    bottom: 95%;
    right: 20px;
  }
}
@media (max-width: 1300px) {
  .theme-button {
    transform: scale(0.35);
    position: fixed;
    bottom: 2%;
    right: 10px;
  }
}
@media (max-width: 576px) {
  .theme-button {
    transform: scale(0.3);
  }
}

.theme-button::before,
.theme-button::after {
  content: "";
  position: absolute;
  transition: .5s all;
}

.theme-button::before {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  background: #e9cb50;
  inset: 7.5px;
  box-shadow:
      0 0 5px #333,
      inset 2px 2px 3px #f8f4e4,
      inset -2px -2px 3px #665613;
  z-index: 1;
}

.theme-button::after {
  width: 70px;
  height: 70px;
  inset: 10px;
  border-radius: 50%;
  box-shadow:
      10px 60px 0 10px #fff,
      65px 60px 0 5px #fff,
      95px 70px 0 10px #fff,
      135px 45px 0 5px #fff,
      170px 35px 0 10px #fff,
      195px -5px 0 10px #fff,
      -10px 0 0 50px rgba(255, 255, 255, .2),
      15px 0 0 50px rgba(255, 255, 255, .15),
      40px 0 0 50px rgba(255, 255, 255, .21),
      10px 40px 0 10px #abc1d9,
      70px 35px 0 10px #abc1d9,
      95px 40px 0 10px #abc1d9,
      135px 20px 0 10px #abc1d9,
      155px 15px 0 10px #abc1d9,
      190px -20px 0 10px #abc1d9;
}

.theme-button:hover::before {
  filter: contrast(90%) brightness(110%);
  scale: 1.05;
}

.theme-button.active {
  background-position: 0 0;
}

.theme-button.active::before {
  transform: translate(130px);
  background:
      radial-gradient(circle at 50% 20px, #939aa5, #939aa5 6.5px, transparent 7px, transparent),
      radial-gradient(circle at 35% 45px, #939aa5, #939aa5 11.5px, transparent 12px, transparent),
      radial-gradient(circle at 72% 50px, #939aa5, #939aa5 8.5px, transparent 9px, transparent),
      radial-gradient(#cbcdda, #cbcdda);
}

.theme-button.active::after {
  transform: translate(130px);
  box-shadow:
      10px 60px 0 10px transparent,
      65px 60px 0 5px transparent,
      95px 70px 0 10px transparent,
      135px 45px 0 5px transparent,
      170px 35px 0 10px transparent,
      195px -5px 0 10px transparent,
      10px 0 0 50px rgba(255, 255, 255, .2),
      -15px 0 0 50px rgba(255, 255, 255, .15),
      -40px 0 0 50px rgba(255, 255, 255, .21),
      10px 40px 0 10px transparent,
      70px 35px 0 10px transparent,
      95px 40px 0 10px transparent,
      135px 20px 0 10px transparent,
      155px 15px 0 10px transparent,
      190px -20px 0 10px transparent;
}
</style>
