<template>
  <div>
    <div v-if="showPage">
      <el-alert
        title="数据收集于安居客新房信息"
        type="info"
        show-icon
        :closable="false">
      </el-alert>
      <el-form :inline="true" size="mini" :model="tableParams">
        <el-form-item label="日期">
          <el-date-picker v-model="tableParams.reportDate" value-format="yyyyMMdd" type="date" />
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
        <el-table-column label="详情" fixed="right" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="houseInfo(scope.row.id)">详情</el-button>
            <el-button size="mini" type="primary" plain @click="houseTrend(scope.row.name)">趋势分析</el-button>
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
    <div class="house-trend" v-else>
      <el-page-header @back="goBack" content="房价趋势" v-loading="chartLoading" />
      <el-form :inline="true" size="mini" :model="trend" class="trend-from">
        <el-form-item label="日期">
          <el-date-picker
            v-model="trend.reportDate"
            value-format="yyyyMMdd"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            :clearable="false"
            @change="dateChange"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div id="myChart" :style="{ width: '100%', height: '300px' }"></div>
    </div>
    <div class="house-detail">
      <el-drawer
        title="详情"
        :visible.sync="drawer"
        :show-close="false"
        size="35%"
      >
        <span>我来啦!</span>
      </el-drawer>
    </div>
  </div>
</template>

<script>
  import { page, trend } from "@/api/house/newHouse";

  export default {
    name: "NewHouse",
    data() {
      return {
        showPage: true,
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
        chartLoading: false,
        drawer: false,
        trend: {
          name: "",
          days: [],
          price: [],
          reportDate: []
        },
        pickerOptions: {
          shortcuts: [{
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          }, {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }, {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }]
        },
        chartTitle: ""
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
        let trendDate = [];
        trendDate.push(this.formatDate(30));
        trendDate.push(this.tableParams.reportDate);
        this.trend.reportDate = trendDate;
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
        page(data)
          .then(res => {
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

      dateChange() {
        this.houseTrend();
      },

      /**
       * 获取趋势信息
       */
      houseTrend(name) {
        this.chartLoading = true;
        if (name) {
          this.trend.name = name;
        }
        const data = {
          name: this.trend.name
        };
        if (this.trend.reportDate.length === 2) {
          data.beginDate = this.trend.reportDate[0];
          data.endDate = this.trend.reportDate[1];
        } else {
          data.beginDate = this.trend.reportDate[0];
        }
        this.initCharTitle();
        trend(data)
          .then(res => {
            const resData = res.data;
            this.trend.days = resData.days;
            this.trend.price = resData.price;
            this.chartLoading = false;
            this.initCharts();
          })
          .catch(() => {
            this.chartLoading = false;
          });
        this.showPage = false;
      },

      /**
       * 生成图表标题
       */
      initCharTitle() {
        let chartTitle = this.trend.reportDate[0] + " ~ ";
        if (this.trend.reportDate.length === 2) {
          chartTitle = chartTitle + this.trend.reportDate[1];
        } else {
          chartTitle = chartTitle + "今日";
        }
        chartTitle = chartTitle + "【" + this.trend.name + "】房价趋势图";
        this.chartTitle = chartTitle;
      },

      /**
       * 初始化图表
       */
      initCharts() {
        let myChart = this.$echarts.init(document.getElementById('myChart'));
        myChart.setOption(
          {
            title: {
              text: this.chartTitle,
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
              data: this.trend.days
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              data: this.trend.price,
              type: 'line',
              smooth: true
            }]
          }
        )
      },

      /**
       * 返回表格模式
       */
      goBack() {
        this.showPage = true;
      },

      /**
       * 显示明细
       * @param id
       */
      houseInfo(id) {
        console.log(id);
        this.drawer = true;
      }


    }
  };
</script>

<style scoped>
  .el-alert {
    margin-bottom: 15px;
  }

  .el-pagination {
    margin-top: 20px;
  }

  .trend-from {
    margin-top: 20px;
  }

  #myChart {
    margin-top: 20px;
  }
</style>
