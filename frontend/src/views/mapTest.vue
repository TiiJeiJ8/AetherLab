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
        const mapName = 'china'; // 直接用注册名
        // 直接插入 <script> 标签导入地图 JS
        const script = document.createElement('script');
        script.src = '/maps/worldCountries/china.js';
        script.onload = () => {
            // 检查地图是否注册
            const mapInfo = echarts.getMap(mapName);
            console.log('mapInfo:', mapInfo);
            if (!mapInfo) {
                this.$refs.chart.innerText = '地图未注册';
                return;
            }
            const option = {
                geo: {
                    map: mapName,
                    roam: true,
                    zoom: 2,
                    center: '',
                    label: {
                        show: true,
                    },
                    itemStyle: {
                        areaColor: '#f3f3f3',
                        borderColor: '#111'
                    },
                },
                visualMap: {
                    min: 0,
                    max: 200,
                    calculable: true,
                    inRange: {
                    color: ['blue', 'green', 'yellow', 'red']
                    }
                },
                series: [{
                    type: 'heatmap',
                    coordinateSystem: 'geo',
                    map: mapName,
                    data: [
                        [113.2668, 23.1322, 100], // 广州
                        [114.3055, 30.5928, 80],  // 武汉
                        [121.4737, 31.2304, 120], // 上海
                        [116.4074, 39.9042, 90]   // 北京
                    ],
                    pointSize: 20,
                    blurSize: 30,
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