<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">新增</el-button>
        <el-button type="warning" icon="el-icon-edit" size="small" @click="handleEdit">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDel">删除</el-button>
      </el-col>
      <el-col :span="8">
        <el-button
          icon="el-icon-connection"
          size="small"
          :disabled="disableBindMenu"
          @click="roleBindMenus"
          :loading="bindLoading"
        >
          保存权限
        </el-button>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="20">
      <!-- 角色列表 -->
      <el-col :span="16">
        <el-table :data="roleList" @row-click="rowClick" @row-dblclick="rowDbClick" v-loading="roleLoading"
                  highlight-current-row>
          <el-table-column prop="name" label="角色" width="200" />
          <el-table-column prop="remark" label="备注" />
        </el-table>
      </el-col>
      <!-- 菜单树 -->
      <el-col :span="8">
        <el-tree
          ref="menu_tree"
          :data="menuTree"
          :props="defaultProps"
          node-key="id"
          show-checkbox
          default-expand-all
          check-on-click-node
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
  import { simpleTree } from "@/api/sys/menu";
  import { add, del, update, list, roleMenus, bindMenus } from "@/api/sys/role";

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
        roleId: "",
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
        roleLoading: false,
        bindLoading: false,
        disableBindMenu: true
      }
    },

    mounted() {
      this.getRoleList();
      this.getMenuTree();
    },

    watch: {
      roleId(newId) {
        this.getRoleMenus(newId);
        if (this.disableBindMenu) {
          this.disableBindMenu = false;
        }
      }
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
       * 获取角色已有的菜单列表
       * @param roleId 角色ID
       */
      getRoleMenus(roleId) {
        this.treeLoading = true;
        roleMenus(roleId)
          .then(res => {
            this.$refs.menu_tree.setCheckedKeys(res.data);
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
        this.roleId = row.id;
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
        this.$confirm(`确定删除角色【${this.role.name}】吗？`, "提示", {
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

      /**
       * 角色绑定菜单
       */
      roleBindMenus() {
        this.bindLoading = true;
        const data = {
          roleId: this.roleId,
          menuIds: this.$refs.menu_tree.getCheckedKeys()
        };
        bindMenus(data)
          .then(() => {
            this.$message({
              type: "success",
              message: "绑定成功！"
            });
            this.bindLoading = false;
          })
          .catch(() => {
          })
      }


    }

  }
</script>

<style scoped>
</style>
