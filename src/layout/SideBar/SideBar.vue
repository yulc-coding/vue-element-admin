<template>
  <!--导航菜单 -->
  <el-menu
    router
    :collapse="isCollapse"
    background-color="#20222A"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item index="/home">
      <i class="el-icon-setting" />
      <span slot="title">首页</span>
    </el-menu-item>
    <el-submenu index="/sys">
      <template slot="title">
        <i class="el-icon-setting" />
        <span slot="title">系统设置</span>
      </template>
      <el-menu-item index="/sys/department">部门管理</el-menu-item>
      <el-menu-item index="/sys/user">用户管理</el-menu-item>
      <el-menu-item index="/sys/role">角色管理</el-menu-item>
      <el-menu-item index="/sys/menu">菜单管理</el-menu-item>
    </el-submenu>
    <el-submenu index="/charts">
      <template slot="title">
        <i class="el-icon-share" />
        <span slot="title">图表</span>
      </template>
      <el-menu-item index="/charts/newHouse">楼盘价格趋势</el-menu-item>
      <el-menu-item index="/charts/oldHouse">二手房价格趋势</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
  export default {
    name: 'SideBar',
    props: ['isCollapse'],
    data() {
      return {
        currentPath: location.pathname
      }
    }
  }
</script>

<style scoped>
  .el-menu {
    border: none;
  }
</style>
