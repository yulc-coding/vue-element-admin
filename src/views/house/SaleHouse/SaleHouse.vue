<template>
  <div id="myChart" :style="{width: '100%', height: '300px'}"></div>
</template>

<script>
  export default {
    name: "SaleHouse",
    data() {
      return {
        name: "",
        days: [],
        prices: []
      }
    },
    mounted() {
      this.initCharts();
    },
    methods: {

      /**
       * 初始化图表
       */
      initCharts() {
        let myChart = this.$echarts.init(document.getElementById('myChart'));
        myChart.setOption(
          {
            title: {
              text: '问题分布情况',
              textStyle: {
                fontWeight: 'normal',
                fontSize: 16
              }
            },
            xAxis: {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: 'line',
              smooth: true
            }]
          }
        )
      }
    }
  }
</script>
