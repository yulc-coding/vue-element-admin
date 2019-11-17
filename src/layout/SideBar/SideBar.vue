<template>
  <div>
    <!--logo-->
    <div class="logo">
      <router-link to="/about">
        <img :src="require('@/assets/logo.png')" alt="后台管理">
      </router-link>
    </div>
    <!--导航菜单 -->
    <el-menu router class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
             :collapse="isCollapse">
      <el-menu-item index="/home">
        <i class="el-icon-setting"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu index="/sys">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span slot="title">系统设置</span>
        </template>
        <el-menu-item index="/sys/department">部门管理</el-menu-item>
        <el-menu-item index="/sys/user">用户管理</el-menu-item>
        <el-menu-item index="/sys/role">角色管理</el-menu-item>
        <el-menu-item index="/sys/permission">菜单管理</el-menu-item>
      </el-submenu>
      <el-submenu index="/charts">
        <template slot="title">
          <i class="el-icon-share"></i>
          <span slot="title">图表</span>
        </template>
        <el-menu-item index="/c1">趋势图</el-menu-item>
        <el-menu-item index="/c2">统计</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: 'SideBar',
    data() {
      return {
        currentPath: location.pathname
      }
    }
  }
</script>

<style>
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
</style>
