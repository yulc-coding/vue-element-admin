<template>
  <el-select v-model="treeValue" ref="menu_select" class="form-item">
    <el-option :label="treeLabel" :value="treeValue" class="tree-option">
      <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" :expand-on-click-node="false"/>
    </el-option>
  </el-select>
</template>

<script>
  export default {
    data() {
      return {
        name: "NewHouse",
        treeLabel: "",
        treeValue: "",
        data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    methods: {
      handleNodeClick(data) {
        console.log(data);
      }
    }
  };
</script>

<style scoped>
  .tree-option {
    height: auto;
    padding: 0;
    font-weight: normal;
  }

  /* 节点的间距 */
  ul li >>> .el-tree .el-tree-node__content {
    height: auto;
  }
</style>
