<template>
  <div class="custom-tree-container">
    <el-input placeholder="输入关键字进行过滤" v-model="filterText" />
    <el-tree
      class="filter-tree"
      :data="data"
      :props="defaultProps"
      default-expand-all
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      ref="tree"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button type="text" size="mini" @click="() => append(data)">Append</el-button>
          <el-button type="text" size="mini" @click="() => edit(data)">Edit</el-button>
          <el-button type="text" size="mini" @click="() => remove(node, data)">Delete</el-button>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
  let id = 1000;

  export default {
    name: "Department",

    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },

    methods: {
      /**
       * 过滤节点
       * @param value 输入框的值
       * @param data 具体的数据
       */
      filterNode(value, data) {
        if (!value) {
          return true;
        }
        return data.label.indexOf(value) !== -1;
      },

      /**
       * 新增节点
       * @param data
       */
      append(data) {
        const newChild = { id: id++, label: 'testtest', children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },

      /**
       * 修改节点
       * @param data 要修改的节点数据
       */
      edit(data) {
        console.log(data.id);
        console.log(data.label);
        console.log(data.children);
        data.label = "new";
      },

      /**
       * 删除节点
       * @param node 要删除的节点
       * @param data
       */
      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      }

    },

    data() {
      return {
        filterText: '',
        data: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    }
  }
</script>

<style scoped>
  .el-tree {
    margin-top: 20px;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
  }
</style>
