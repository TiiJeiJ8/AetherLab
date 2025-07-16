<!--todo Card-->
<template>
  <div :class="`Main-body border-0 shadow-sm animate__FadeIn_sI hover-card`" style="z-index: var(--z-index-cards);">
    <div class="card-body text-center">
      <div class="text-primary mb-3" style="font-size: 3rem; user-select: none;">
        {{ icon }}
      </div>
      <h4 class="card-title mb-3">{{ title }}</h4>
      <p class="text-muted">{{ description }}</p>
      <button
        :class="`home-btn mt-3 px-4 py-2 btn-animated hover-button ${buttonColor}`"
        @click="handleClick"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { computed, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { handleCardClick } from '@/assets/JS/utils/cardUtils.js'

const props = defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  buttonText: { type: String, required: true },
  href: { type: String, required: true },
  isDeveloping: { type: Boolean, default: true },
  isExternal: { type: Boolean, default: false }
})

const router = useRouter()

const buttonColor = computed(() => props.isDeveloping ? 'btn-secondary' : 'btn-primary')

function handleClick() {
  handleCardClick({
    href: props.href,
    isExternal: props.isExternal,
    isDeveloping: props.isDeveloping
  }, router)
}
</script>

<style scoped>
.Main-body {
  margin-left: 4%;
  margin-right: 4%;
  margin-top: 2%;
  border-radius: 7.8px;
  height: 250px;
}
</style>
