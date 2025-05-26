<template>
  <div :class="`Main-body border-0 shadow-sm animate__FadeIn_sI hover-card ${animationClass}`">
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

<script>
export default {
  name: 'BaseCard',
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    buttonText: {
      type: String,
      required: true
    },
    href: {
      type: String,
      required: true
    },
    isDeveloping: {
      type: Boolean,
      default: true
    },
    isExternal: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonColor () {
      return this.isDeveloping ? 'btn-secondary' : 'btn-primary'
    },
    animationClass () {
      return 'animate__animated'
    }
  },
  methods: {
    handleClick () {
      if (this.isExternal) {
        window.open(this.href, '_blank')
      } else if (!this.isDeveloping) {
        this.$router.push(this.href)
      } else {
        this.$router.push('/under-construction')
      }
    }
  }
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
