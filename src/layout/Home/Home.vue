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
        <MainContent />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import SideBar from "../../layout/SideBar/SideBar";
  import HeadBar from "../../layout/HeadBar/HeadBar";
  import MainContent from "../../layout/MainContent/MainContent";

  export default {
    name: "Home",
    components: { SideBar, HeadBar, MainContent },
    computed: {
      isCollapse() {
        return this.$store.state.isCollapse
      },
      asideWidth() {
        return this.$store.state.isCollapse ? 'auto' : '200px'
      }
    }
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
