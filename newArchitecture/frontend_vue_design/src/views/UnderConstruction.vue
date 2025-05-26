<template>
  <div class="min-vh-100 bg-light d-flex align-items-center">
    <div class="container py-5 text-center animate__animated animate__fadeIn" style="position: relative; z-index: 1;">
      <div class="row justify-content-center mb-4">
        <div class="col-lg-8">
          <div class="construction-icon mb-4">
            <span
              class="display-1 animate__animated animate__pulse animate__infinite"
              style="font-size: 8rem; user-select: none;"
            >🚧</span>
          </div>
          <h1
            class="dynamic-gradient-text-construction mb-4"
            style="font-size: 3.5rem; user-select: none;"
          >Under Construction</h1>
          <p class="lead text-muted mb-5" style="font-size: 1.5rem;">
            <span class="d-inline-block dynamic-gradient-text-construc-sub" style="font-size: 2rem;">TiiJeiJ8</span>
            <span> is exerting to his utmost!!!  💪</span>
          </p>
          <router-link
            to="/"
            class="btn btn-primary px-5 py-3 btn-animated hover-button"
            style="border-radius: 2rem;"
          >Back to Home page</router-link>
          <div class="mt-5">
            <p class="text-uppercase text-muted mb-2" style="letter-spacing: 2px;">Estimated Launch Date</p>
            <div
              class="text-muted mb-2"
              style="font-family: monospace; letter-spacing: 2px;"
              v-html="countdownText"></div>
          </div>
        </div>
      </div>
      <footer class="text-center text-muted p-3 mt-4 border-top position-absolute bottom-0 start-50 translate-middle-x">
        Fuck Charts © {{ currentYear }} - TiiJeiJ8
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UnderConstruction',
  data () {
    return {
      countdownText: '',
      currentYear: new Date().getFullYear(),
      targetDate: new Date('2099-12-29'),
      interval: null
    }
  },
  mounted () {
    this.updateCountdown()
    this.interval = setInterval(this.updateCountdown, 1000)
  },
  beforeUnmount () {
    clearInterval(this.interval)
  },
  methods: {
    updateCountdown () {
      const now = new Date()
      const remaining = this.targetDate - now

      if (remaining <= 0) {
        this.countdownText = 'Go go go !!🎉'
        return
      }

      const seconds = Math.floor(remaining / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)
      const years = Math.floor(days / 365)
      const remainingDays = days % 365

      const formattedDate = this.targetDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })

      this.countdownText = `${formattedDate}<br>${years} Years ${remainingDays} Days ${hours % 24} Hours ${minutes % 60} Minutes ${seconds % 60} Seconds`
    }
  }
}
</script>

<style scoped>
.dynamic-gradient-text-construction {
  background: linear-gradient(45deg, #6a11cb, #3775e0, #dd2476);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  background-size: 300% 300%;
  animation: gradient 8s ease infinite;
}

.dynamic-gradient-text-construc-sub {
  background: linear-gradient(45deg, #6a11cb, #2575fc);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.btn-animated {
  transition: transform 0.3s;
}

.btn-animated:hover {
  transform: scale(1.05);
}

.btn-animated:active {
  transform: scale(0.95);
}

.hover-button {
  transition: transform 0.75s ease, box-shadow 0.3s ease;
}

.hover-button:hover {
  transform: scale(1.1) rotate(10deg);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>
