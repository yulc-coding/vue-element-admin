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
          <el-button type="text" size="mini" @click="() => openDialog(data)">Append</el-button>
          <el-button type="text" size="mini" @click="() => edit(data)">Edit</el-button>
          <el-button type="text" size="mini" @click="() => remove(node, data)">Delete</el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      center
    >
      <el-form :model="depForm" :rules="rules">
        <el-form-item label="上级部门" :label-width="formLabelWidth">
          <el-input v-model="depForm.pName" disabled></el-input>
        </el-form-item>
        <el-form-item label="部门编码" :label-width="formLabelWidth">
          <el-input v-model="depForm.code" disabled></el-input>
        </el-form-item>
        <el-form-item label="部门名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="depForm.name" maxlength="10" show-word-limit />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="depForm.remark" maxlength="50" show-word-limit />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="()=> append()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  // import { add, del, update, getInfo, tree } from '@/api/department'

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
       *
       */
      openDialog(data) {
        this.dialogTitle = "新增部门";
        this.dialogVisible = true;
        this.depForm.pid = data.id;
        this.depForm.pName = data.label;
        this.cueNodeData = data;
      },

      closeDialog() {
        this.dialogTitle = "";
        this.dialogVisible = false;
        this.depForm.id = "";
        this.depForm.pid = "";
        this.depForm.pName = "";
        this.depForm.code = "";
        this.depForm.name = "";
        this.depForm.remark = "";
        this.cueNodeData = {};
      },

      /**
       * 新增节点
       */
      append() {
        const newChild = { id: id++, label: 'testtest', children: [] };
        const data = this.cueNodeData;
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
        this.closeDialog();
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
       * @param node 当前节点
       * @param data 要删除的节点数据
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
        filterText: "",
        dialogTitle: "",
        dialogVisible: false,
        formLabelWidth: '80px',
        cueNodeData: {},
        depForm: {
          id: "",
          code: "",
          name: "",
          pid: "",
          pName: "",
          remark: ""
        },
        rules: {
          name: [
            { required: true, message: '请输入部门名称', trigger: 'blur' }
          ]
        },
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
