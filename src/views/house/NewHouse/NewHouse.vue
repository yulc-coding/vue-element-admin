<template>
  <div id="myChart" :style="{width: '100%', height: '300px'}"></div>
</template>

<script>
  export default {
    name: "NewHouse",
    data() {
      return {
        curDate: null,
        trend: {
          name: "",
          days: [],
          prices: [],
          beginDate: null,
          endDate: null
        }
      }
    },
    mounted() {
      this.initCharts();
    },
    methods: {
      /**
       * 初始化查询时间
       * 列表默认查当天数据，
       * 趋势图默认查30天数据
       */
      initDate() {

      },

      /**
       * 分页列表
       */
      housePage() {
      },

      /**
       * 获取趋势信息
       */
      houseTrend() {

      },

      /**
       * 初始化图表
       */
      initCharts() {


        let myChart = this.$echarts.init(document.getElementById('myChart'));
        myChart.setOption(
          {
            title: {
              text: this.initCharTitle(),
              textStyle: {
                fontWeight: 'normal',
                fontSize: 16
              }
            },
            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              //data: this.trend.days
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              //data: this.trend.prices,
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: 'line',
              smooth: true
            }]
          }
        )
      },

      /**
       * 生成图表标题
       */
      initCharTitle() {
        let chartTitle = this.trend.beginDate + " ~ ";
        if (this.trend.endDate) {
          chartTitle = chartTitle + this.trend.endDate;
        } else {
          chartTitle = chartTitle + "今日";
        }
        chartTitle = chartTitle + "【" + this.trend.name + "】房价趋势图";
        return chartTitle;
      },

    }
  };
</script>
