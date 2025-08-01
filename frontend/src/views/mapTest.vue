<template>
    <div>
    <h2>地图测试页面</h2>
    <div ref="chart" style="width: 600px; height: 400px;"></div>
</div>
</template>

<script>
/* eslint-disable */
import * as echarts from 'echarts'
window.echarts = echarts;


export default {
    name: 'MapTest',
    mounted() {
        const mapName = 'china-cities'; // 直接用注册名
        // 直接插入 <script> 标签导入地图 JS
        const script = document.createElement('script');
        script.src = '/maps/worldCountries/china-cities.js';
        script.onload = () => {
            // 检查地图是否注册
            const mapInfo = echarts.getMap(mapName);
            console.log('mapInfo:', mapInfo);
            if (!mapInfo) {
                this.$refs.chart.innerText = '地图未注册';
                return;
            }
            const option = {
                series: [{
                    type: 'map',
                    map: mapName,
                    data: [{ name: mapName, value: 100 }]
                }]
            };
            const chart = echarts.init(this.$refs.chart);
            chart.setOption(option);
        };
        script.onerror = () => {
            this.$refs.chart.innerText = '地图JS加载失败';
        };
        document.head.appendChild(script);
    }
}
</script>