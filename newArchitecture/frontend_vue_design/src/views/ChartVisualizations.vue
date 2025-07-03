<template>
  <div class="py-5">
    <TopBar :actions="[
      { type: 'button', label: 'Upload Files', onClick: UploadFiles },
      { type: 'button', label: 'Data Preview', },
      { type: 'button', label: 'DashBoard', },
      { type: 'button', label: 'Color Palette', to: 'https://coolors.co/palettes/trending', external: true },
      { type: 'button', label: 'Instruction', },
      { type: 'button', label: 'Back2Home', to: '/'},
    ]"/>
  </div>

  <SideBar position="left">
    <button>图表列表</button>
  </SideBar>

  <SideBar position="right">
    <button>图表设置</button>
  </SideBar>

  <!-- 工作区 -->
  <div>
  </div>
</template>

<script>
import TopBar from '../components/TopBar.vue'
import SideBar from '../components/SideBar.vue'

export default {
  name: 'ChartVisualizations',
  components: {
    TopBar,
    SideBar
  }
}
</script>
