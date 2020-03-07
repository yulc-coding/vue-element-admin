<template>
  <div>
    <div v-if="showPage">
      <el-alert
        title="数据收集于安居客二手房信息"
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
        <el-table-column prop="allPrice" label="总价" width="180" />
        <el-table-column prop="unitPrice" label="单价" width="180" />
        <el-table-column prop="houseType" label="户型" show-overflow-tooltip />
        <el-table-column label="详情" fixed="right" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="houseInfo(scope.row.id)">详情</el-button>
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
      <el-page-header @back="goBack" content="详情" />
    </div>
    <div class="house-detail">
      <el-drawer
        title="详情"
        :visible.sync="drawer"
        :show-close="false"
        size="35%"
      >
        <el-form :model="houseDetail" label-width="80px">
          <el-form-item label="城市">
            <span>{{ houseDetail.city }}</span>
          </el-form-item>
          <el-form-item label="名称">
            <span>{{ houseDetail.name }}</span>
          </el-form-item>
          <el-form-item label="价格">
            <span>总价：{{ houseDetail.allPrice }}，单价：{{ houseDetail.unitPrice }}</span>
          </el-form-item>
          <el-form-item label="户型">
            <span>{{ houseDetail.houseType }}</span>
          </el-form-item>
          <el-form-item label="标签">
            <span>{{ houseDetail.tags }}</span>
          </el-form-item>
          <el-form-item label="地址">
            <span>{{ houseDetail.address }}</span>
          </el-form-item>
          <el-form-item label="图片">
            <a :href="houseDetail.picLink" target="_blank">
              <img :src="houseDetail.pic">
            </a>
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
  </div>
</template>

<script>
  import { page, findById } from "@/api/house/saleHouse";

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
        houseDetail: {},
        drawer: false
      }
    },
    mounted() {
      this.initDate();
    },
    methods: {
      /**
       * 初始化查询时间
       * 列表默认查当天数据
       */
      initDate() {
        this.tableParams.reportDate = this.formatDate(0);
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


      /**
       * 详情
       * @param id
       */
      houseInfo(id) {
        console.log(id);
        findById(id)
          .then(res => {

          })
      },

      /**
       * 返回表格模式
       */
      goBack() {
        this.showPage = true;
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
