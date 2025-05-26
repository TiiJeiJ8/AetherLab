<template>
  <div class="py-5 HomeMain-container">
    <!-- 标题区 -->
    <div class="text-center mb-5 animate__fadeIn">
      <div>
        <h1
        class="text-center mb-2 d-inline-block dynamic-gradient-text-home"
        style="user-select: none;"
        >Fuck Charts</h1>
        <p
        class="lead text-muted dynamic-gradient-text-sub"
        style="user-select: none;"
        >---- Present by TiiJeiJ8 ----</p>
      </div>
    </div>

    <!-- 功能卡片 -->
    <div class="row g-4">
      <!-- 数据可视化卡片 -->
      <div class="col-lg-4">
        <Card
          icon="📈"
          title="Data Visualization"
          description="Interactive charts"
          buttonText="Explore"
          href="/chart-visualizations"
          :isDeveloping="false"
        />
      </div>

      <!-- 数据预处理卡片 -->
      <div class="col-lg-4">
        <Card
          icon="🔍"
          title="Data Preprocessing 🚧"
          description="Explore, analyze and preprocess data"
          buttonText="Explore"
          href="/data-preprocessing"
          :isDeveloping="false"
        />
      </div>

      <!-- 数据聚类卡片 -->
      <div class="col-lg-4">
        <Card
          icon="🥜"
          title="Data Clustering 🚧"
          description="Data clustering and visualization"
          buttonText="Developing"
          href=""
        />
      </div>

      <!-- 数学建模卡片 -->
      <div class="col-lg-4">
        <Card
          icon="✏️"
          title="Mathematical Modeling 🚧"
          description="Data modeling and analysis"
          buttonText="Developing"
          href=""
        />
      </div>

      <!-- 配色网站卡片 -->
      <div class="col-lg-4">
        <Card
          icon="🎨"
          title="Color Palette"
          description="Trend color palette"
          buttonText="Explore"
          href="https://coolors.co/palettes/trending"
          :isDeveloping="false"
          :isExternal="true"
        />
      </div>

      <!-- About Me卡片 -->
      <div class="col-lg-4">
        <Card
          icon="🫣"
          title="About Me"
          description="Learn more about me ¯\_(ツ)_/¯"
          buttonText="Explore"
          href="https://tiijeij8.github.io"
          :isDeveloping="false"
          :isExternal="true"
        />
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="text-center text-muted p-3 mt-4 border-top">
      Fuck Charts © {{ year }} - TiiJeiJ8
    </footer>
  </div>
</template>

<script>
import BaseCard from '../components/Card.vue'

export default {
  components: {
    Card: BaseCard
  },
  data () {
    return {
      year: new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
.HomeMain-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
