<template>
  <el-container>
    <el-aside width="200px">
      <SideBar />
    </el-aside>
    <el-container>
      <el-header>
        <HeadBar />
      </el-header>
      <el-main>
        <router-view v-if="isRouterAlive" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import SideBar from "../../layout/SideBar/SideBar";
  import HeadBar from "../../layout/HeadBar/HeadBar";

  export default {
    name: "Index",
    components: { SideBar, HeadBar },
    provide() {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        isRouterAlive: true
      }
    },
    computed: {
      isCollapse() {
        return this.$store.state.isCollapse
      },
      asideWidth() {
        return this.$store.state.isCollapse ? 'auto' : '200px'
      }
    },
    methods: {
      reload() {
        this.isRouterAlive = false;
        this.$nextTick(() => {
          this.isRouterAlive = true;
        })
      }
    },
  };
</script>

<style scoped>
  .el-aside {
    background-color: #20222A;
    height: 100vh;
    min-height: 100%;
  }

  .el-header {
    border-bottom: 1px solid #f6f6f6;
    box-sizing: border-box;
    background-color: #fff;
    line-height: 60px;
    text-align: right;
    font-size: 12px
  }
</style>
