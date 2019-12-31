<template>
  <div>
    <div>
      <el-form :inline="true" size="mini" :model="tableParams">
        <el-form-item label="日期">
          <el-input v-model="tableParams.reportDate" />
        </el-form-item>
        <el-form-item label="地区">
          <el-input v-model="tableParams.city" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="tableParams.name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="housePage">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="houses" style="width: 100%" v-loading="loading" stripe>
        <el-table-column prop="city" label="城市" width="150" />
        <el-table-column prop="name" label="名称" width="200" />
        <el-table-column prop="price" label="价格" width="180" />
        <el-table-column prop="houseType" label="户型" show-overflow-tooltip />
        <el-table-column label="详情" fixed="right" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="houseTrend(scope.row.id)">趋势分析</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="size"
        :current-page="page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <div>
      <el-page-header @back="goBack" content="房价趋势" />
      <div>
        时间选择
      </div>
      <div id="myChart" :style="{width: '100%', height: '300px'}"></div>
    </div>
  </div>
</template>

<script>
  import { page } from "@/api/house/newHouse";

  export default {
    name: "NewHouse",
    data() {
      return {
        tableParams: {
          reportDate: null,
          city: null,
          name: null
        },
        houses: [],
        page: 1,
        size: 10,
        total: 0,
        loading: false,
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
      this.initDate();
    },
    methods: {
      /**
       * 初始化查询时间
       * 列表默认查当天数据，
       * 趋势图默认查30天数据
       */
      initDate() {
        this.tableParams.reportDate = this.formatDate(0);
        this.trend.endDate = this.reportDate;
        this.trend.beginDate = this.formatDate(30);
        this.housePage();
      },

      /**
       * 格式化日期
       * @param days 几天前
       */
      formatDate(days) {
        let curDate = new Date();
        if (days > 0) {
          curDate.setDate(curDate.getDate() - days);
        }
        const year = curDate.getFullYear();
        const month = curDate.getMonth() < 9 ? "0" + (curDate.getMonth() + 1) : curDate.getMonth() + 1;
        const day = curDate.getDate() < 10 ? "0" + curDate.getDate() : curDate.getDate();
        return "" + year + month + day;
      },

      /**
       * 每页显示数量变化
       */
      handleSizeChange(val) {
        this.size = val;
        this.housePage();
      },

      /**
       * 当前页数变化
       */
      handleCurrentChange(val) {
        this.page = val;
        this.housePage();
      },

      /**
       * 分页列表
       */
      housePage() {
        this.loading = true;
        let data = {
          "curPage": this.page,
          "pageSize": this.size,
          "reportDate": this.tableParams.reportDate
        };
        if (this.tableParams.city) {
          data.city = this.tableParams.city;
        }
        if (this.tableParams.name) {
          data.name = this.tableParams.name;
        }
        page(data).then(res => {
          const resData = res.data;
          this.houses = resData.records;
          this.page = resData.curPage;
          this.total = resData.totalCount;
          this.loading = false;
        })
          .catch(() => {
            this.loading = false;
          });
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

      goBack() {

      }

    }
  };
</script>
