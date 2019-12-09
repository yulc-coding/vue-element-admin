<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div class="tool-box">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">新增</el-button>
          <el-button type="warning" icon="el-icon-edit" size="small" @click="handleEdit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDel">删除</el-button>
        </div>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="20">
      <!-- 角色列表 -->
      <el-col :span="14">
        <el-table :data="roleList" @row-click="rowClick" @row-dblclick="rowDbClick" v-loading="roleLoading"
                  highlight-current-row>
          <el-table-column prop="name" label="角色" width="200" />
          <el-table-column prop="remark" label="备注" />
        </el-table>
      </el-col>
      <!-- 菜单树 -->
      <el-col :span="10">
        <el-tree
          :data="menuTree"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          v-loading="treeLoading"
        />
      </el-col>
    </el-row>
    <el-dialog
      :title="dialogTitle"
      width="500px"
      :visible.sync="roleFormVisible"
      @close="resetForm()"
    >
      <el-form :model="role" :rules="rules" ref="roleForm" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="role.name" maxlength="10" show-word-limit />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="role.remark" maxlength="10" show-word-limit />
        </el-form-item>
        <el-form-item class="button-item">
          <el-button @click="cancelSubmit()">放 弃</el-button>
          <el-button type="primary" @click="submitForm('roleForm')">提 交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { simpleTree } from "@/api/menu";
  import { add, del, update, list } from "@/api/role";

  export default {
    name: "Role",
    data() {
      return {
        roleList: [],
        role: {
          id: null,
          name: "",
          remark: ""
        },
        menuTree: [],
        defaultProps: {
          children: "children",
          label: "name"
        },
        roleFormVisible: false,
        dialogTitle: "",
        rules: {
          name: [{ required: true, message: "请输入名称", trigger: "blur" }]
        },
        treeLoading: false,
        roleLoading: false
      }
    },

    mounted() {
      this.getRoleList();
      this.getMenuTree();
    },

    methods: {
      /**
       * 获取角色列表
       */
      getRoleList() {
        this.roleLoading = true;
        list()
          .then(res => {
            this.roleList = res.data;
            this.roleLoading = false;
          })
          .catch(() => {
          })
      },

      /**
       * 获取简单菜单树结构
       */
      getMenuTree() {
        this.treeLoading = true;
        simpleTree()
          .then(res => {
            this.menuTree = res.data.children;
            this.treeLoading = false;
          })
          .catch(() => {
          })
      },

      /**
       * 重置表单
       */
      resetForm() {
        this.role = {
          id: null,
          name: "",
          remark: ""
        }
      },

      /**
       * 单击行
       * @param row 行数据
       */
      rowClick(row) {
        this.role = {
          id: row.id,
          name: row.name,
          remark: row.remark
        };
      },

      /**
       * 双击行
       */
      rowDbClick() {
        this.roleFormVisible = true;
      },

      /**
       * 新增操作
       */
      handleAdd() {
        this.resetForm();
        this.dialogTitle = "新增";
        this.roleFormVisible = true;
      },

      /**
       * 编辑操作
       */
      handleEdit() {
        if (this.role.id) {
          this.dialogTitle = "编辑";
          this.roleFormVisible = true;
        } else {
          this.$message({
            type: "warning",
            message: "请选择要编辑的角色！"
          });
        }
      },

      /**
       * 删除角色
       */
      handleDel() {
        if (!this.role.id) {
          this.$message({
            type: "warning",
            message: "请选择要删除的角色！"
          });
          return;
        }
        this.$confirm(`确定删除角色 ${this.role.name} 吗？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          del(this.role.id)
            .then(() => {
              this.$message({
                type: "success",
                message: "删除成功！"
              });
              this.getRoleList();
              this.roleFormVisible = false;
            })
            .cache(() => {
            })
        }).catch(() => {
        })
      },

      /**
       * 取消编辑
       */
      cancelSubmit() {
        this.roleFormVisible = false;
      },

      /**
       * 提交表单
       */
      submitForm(formName) {
        // 表单验证
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.role.id) {
              this.editRole();
            } else {
              this.addRole();
            }
          }
        });
      },

      /**
       * 新增角色
       */
      addRole() {
        add(this.role)
          .then(() => {
            this.$message({
              type: "success",
              message: "新增成功！"
            });
            this.getRoleList();
            this.roleFormVisible = false;
          })
          .catch(() => {
          })
      },

      /**
       * 编辑角色
       */
      editRole() {
        update(this.role)
          .then(() => {
            this.$message({
              type: "success",
              message: "编辑成功！"
            });
            this.getRoleList();
            this.roleFormVisible = false;
          })
          .catch(() => {
          })
      },

    }

  }
</script>

<style scoped>

</style>
