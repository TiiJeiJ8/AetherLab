<template>
  <div class="min-vh-100 bg-light position-relative">
    <router-view></router-view>
    <div id="ball-background"></div>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    // Some random colors
    const colors = ['#3CC157', '#2AA7FF', '#1B1B1B', '#FCBC0F', '#F85F36', '#eb4690', '#9954e2', '#6a11cb', '#2575fc']
    const numBalls = 50
    const balls = []
    const background = document.getElementById('ball-background')

    for (let i = 0; i < numBalls; i++) {
      const ball = document.createElement('div')
      ball.classList.add('ball')
      ball.style.background = colors[Math.floor(Math.random() * colors.length)]
      ball.style.left = `${Math.floor(Math.random() * 100)}vw`
      ball.style.top = `${Math.floor(Math.random() * 100)}vh`
      ball.style.transform = `scale(${Math.random()})`
      ball.style.width = `${Math.random()}em`
      ball.style.height = ball.style.width
      balls.push(ball)
      background.append(ball)
    }

    // Keyframes
    balls.forEach((el, i) => {
      const to = {
        x: Math.random() * (i % 2 === 0 ? -11 : 11),
        y: Math.random() * 12
      }

      el.animate(
        [
          { transform: 'translate(0, 0)' },
          { transform: `translate(${to.x}rem, ${to.y}rem)` }
        ],
        {
          duration: (Math.random() + 1) * 2000,
          direction: 'alternate',
          fill: 'both',
          iterations: Infinity,
          easing: 'ease-in-out'
        }
      )
    })
  }
}
</script>

<style>
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css');
@import './assets/CSS/btn.css';
@import './assets/CSS/index_style.css';
@import './assets/CSS/construction_style.css';

#ball-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.ball {
  position: absolute;
  border-radius: 50%;
  opacity: 0.7;
  z-index: -1;
}
</style>
