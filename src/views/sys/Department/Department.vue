<template>
  <div class="custom-tree-container">
    <el-input placeholder="输入关键字进行过滤" v-model="filterText" />
    <el-button type="text" icon="el-icon-folder-add" @click="openDialogForAddRoot()">添加根目录</el-button>
    <el-tree
      class="filter-tree"
      :data="depTree"
      :props="defaultProps"
      default-expand-all
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      ref="dep_tree"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button type="text" size="mini" icon="el-icon-folder-opened"
                     @click="() => openDialogForAddChildren(data)">添加</el-button>
          <el-button type="text" size="mini" icon="el-icon-edit"
                     @click="() => openDialogForEdit(node, data)">编辑</el-button>
          <el-button type="text" size="mini" icon="el-icon-delete"
                     @click="() => remove(node, data)">删除</el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      center
    >
      <el-form ref="depForm" :model="depForm" :rules="rules">
        <el-form-item label="上级部门" :label-width="formLabelWidth">
          <el-input v-model="depForm.pName" disabled />
        </el-form-item>
        <el-form-item label="部门编码" :label-width="formLabelWidth">
          <el-input v-model="depForm.code" disabled />
        </el-form-item>
        <el-form-item label="部门名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="depForm.name" maxlength="10" show-word-limit />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="depForm.remark" maxlength="50" show-word-limit />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDialog('depForm')">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { add, del, update, tree } from "@/api/department";

  export default {
    name: "Department",

    data() {
      return {
        formLabelWidth: "80px",
        filterText: "",
        dialogTitle: "",
        dialogVisible: false,
        // 表单提交类别 ：edit,addRoot,addChildren
        submitType: "",
        // 操作节点时当前节点的信息
        cueNodeData: {},
        // 表单实体
        depForm: {
          id: "",
          code: "",
          name: "",
          pid: "",
          pName: "",
          remark: ""
        },
        // 表单验证
        rules: {
          name: [{ required: true, message: "请输入部门名称", trigger: "blur" }]
        },
        depTree: [],
        defaultProps: {
          children: "children",
          label: "name"
        }
      };
    },

    watch: {
      filterText(val) {
        this.$refs.dep_tree.filter(val);
      }
    },

    mounted() {
      this.getTree();
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
        return data.name.indexOf(value) !== -1;
      },

      /**
       * 获取树
       */
      getTree() {
        tree()
          .then(res => {
            this.depTree = res.data.children;
          })
          .catch(err => {
            console.error(err);
          });
      },

      /**
       * 新增根目录
       */
      openDialogForAddRoot() {
        this.submitType = "addRoot";
        this.dialogTitle = "新增部门";
        this.dialogVisible = true;
        this.depForm.pid = 0;
        this.depForm.pName = "根目录";
      },

      /**
       * 打开新增面板
       */
      openDialogForAddChildren(data) {
        this.submitType = "addChildren";
        this.dialogTitle = "新增部门";
        this.dialogVisible = true;
        this.cueNodeData = data;
        this.depForm.pid = data.id;
        this.depForm.pName = data.name;
      },

      /**
       * 设置上级节点的信息
       */
      setParentData(curNode) {
        const parentData = curNode.parent.data;
        if (parentData.id) {
          this.depForm.pid = parentData.id;
          this.depForm.pName = parentData.name;
        } else {
          this.depForm.pid = 0;
          this.depForm.pName = "根目录";
        }
      },

      /**
       * 打开修改面板
       */
      openDialogForEdit(node, data) {
        this.setParentData(node);
        this.submitType = "edit";
        this.dialogTitle = "修改部门";
        this.dialogVisible = true;
        this.depForm.id = data.id;
        this.depForm.code = data.code;
        this.depForm.name = data.name;
        this.depForm.remark = data.remark;
        this.cueNodeData = data;
      },

      /**
       * 关闭弹窗，并清空表单数据
       */
      closeDialog() {
        this.dialogTitle = "";
        this.dialogVisible = false;
        this.submitType = "";
        this.depForm.id = "";
        this.depForm.pid = "";
        this.depForm.pName = "";
        this.depForm.code = "";
        this.depForm.name = "";
        this.depForm.remark = "";
        this.cueNodeData = {};
      },

      /**
       * 提交表单，判断新增还是修改
       */
      submitDialog(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.submitType === "edit") {
              this.edit();
            } else {
              this.append();
            }
          }
        });
      },

      /**
       * 新增节点
       */
      append() {
        let childNode = {
          name: this.depForm.name,
          pid: this.depForm.pid,
          remark: this.depForm.remark
        };
        add(childNode)
          .then(res => {
            // 新增根目录
            if (this.submitType === "addRoot") {
              if (this.depTree) {
                // 已存在的追加
                this.depTree.push(res.data);
              } else {
                // 不存在的初始化
                this.depTree = new Array(res.data);
              }
            } else {
              // 新增普通子节点
              const nodeData = this.cueNodeData;
              if (!nodeData.children) {
                this.$set(nodeData, "children", []);
              }
              nodeData.children.push(res.data);
            }
            this.$message({
              message: '新增成功',
              type: 'success'
            });
            this.closeDialog();
          })
          .catch(() => {
          });
      },

      /**
       * 修改节点
       */
      edit() {
        let data = {
          id: this.depForm.id,
          name: this.depForm.name,
          remark: this.depForm.remark
        };
        update(data)
          .then(() => {
            const nodeData = this.cueNodeData;
            nodeData.name = data.name;
            nodeData.remark = data.remark;
            this.closeDialog();
            this.$message({
              message: '修改成功',
              type: 'success'
            });
          })
          .catch(() => {
          });
      },

      /**
       * 删除节点
       * @param node 当前节点
       * @param data 要删除的节点数据
       */
      remove(node, data) {
        this.$confirm('确定要删除【' + data.name + '】部门?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del(data.id)
            .then(() => {
              const parent = node.parent;
              const children = parent.data.children || parent.data;
              const index = children.findIndex(d => d.id === data.id);
              children.splice(index, 1);
              this.$message({
                message: "删除成功",
                type: "success"
              });
            })
            .catch(err => {
              console.error(err);
              this.closeDialog();
            });
        }).catch(() => {
        });
      }
    }
  };
</script>

<style scoped>

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
  }
</style>
