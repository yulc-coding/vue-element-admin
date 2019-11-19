<template>
  <el-container class="index-box">
    <el-aside :width="asideWidth">
      <!--logo-->
      <div class="logo">
        <router-link to="/home">
          <img v-show="!isCollapse" :src="require('@/assets/logo.png')" alt="后台管理">
        </router-link>
      </div>
      <SideBar :isCollapse="isCollapse" />
    </el-aside>
    <el-container>
      <el-header>
        <HeadBar :isCollapse="isCollapse" />
      </el-header>
      <el-main>
        <router-view />
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

    data() {
      return {}
    },

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

  .index-box {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
  }

  .index-box .el-container {
    height: 100%;
  }

  .index-box .el-container .el-main {
    height: 100%;
  }

  .el-aside {
    background-color: #20222A;
    height: 100vh;
    min-height: 100%;
  }

  .logo {
    background-color: #20222A;
    color: rgba(255, 255, 255, .8);
    text-align: center;
    height: 60px;
    padding-top: 16px;
    font-size: 16px;
    box-sizing: border-box;
    border-bottom: 1px solid gray;
  }

  .el-header {
    border-bottom: 1px solid #f6f6f6;
    box-sizing: border-box;
    background-color: #fff;
    line-height: 60px;
    font-size: 12px
  }
</style>
