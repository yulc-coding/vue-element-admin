<template>
  <el-container>
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <SideBar/>
    </el-aside>
    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <HeadBar/>
      </el-header>
      <el-main>
        <MainContent/>
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
    components: { SideBar, HeadBar, MainContent }
  };
</script>

<style scoped></style>
