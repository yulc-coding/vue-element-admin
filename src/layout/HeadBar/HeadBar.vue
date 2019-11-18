<template>
  <div>
    <el-row type="flex" justify="space-between">
      <el-col :span="6">
        <button v-show="!isCollapse" class="btn-tool" title="折叠" @click="collapse">
          <i class="el-icon-d-arrow-left"></i>
        </button>
        <button v-show="isCollapse" class="btn-tool" title="展开" @click="collapse">
          <i class="el-icon-d-arrow-right"></i>
        </button>
      </el-col>
      <el-col :span="6" align="right">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>王小虎</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "HeadBar",
    props: ['isCollapse'],
    data() {
      return {
        notes: localStorage.getItem('notes') || '便签中的内容会存储在本地，这样即便你关掉了浏览器，在下次打开时，依然会读取到上一次的记录。是个非常小巧实用的本地备忘录'
      }
    },
    methods: {
      collapse() {
        this.$store.commit('switchCollapse')
      },
      saveNotes() {
        localStorage.setItem('notes', this.notes)
      },
    },
    computed: {
      username() {
        let { username } = JSON.parse(sessionStorage.getItem('user'))
        return username.toUpperCase()
      }
    }
  };
</script>

<style scoped>
  .btn-tool {
    border: none;
    background: transparent;
    font-size: 18px;
    padding: 5px 10px;
    cursor: pointer;
    outline: none;
    text-align: left;
  }

</style>
