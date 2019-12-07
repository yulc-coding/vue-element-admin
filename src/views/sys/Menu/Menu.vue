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
      <el-col :span="6">
        <el-tree
          :data="menuTree"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
          v-loading="loading"
        />
      </el-col>
      <el-col :span="18">
        <el-form ref="menuForm" :model="menuForm" :rules="rules" :disabled="formDisable" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="上级" prop="pid">
                <el-select v-model="menuForm.pid" ref="menu_select" class="form-item">
                  <el-option :label="menuForm.pName" :value="menuForm.pid" class="tree-option">
                    <el-tree
                      :data="selectMenuTree"
                      :props="defaultProps"
                      default-expand-all
                      :expand-on-click-node="false"
                      @node-click="chooseMenu" />
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="名称" prop="name">
                <el-input v-model="menuForm.name" maxlength="32" show-word-limit />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="排序" prop="seq">
                <el-input-number v-model="menuForm.seq" :min="0" class="form-item" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="权限">
                <el-input v-model="menuForm.permission" maxlength="32" show-word-limit />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="类别" prop="type">
                <el-select v-model="menuForm.type" class="form-item">
                  <el-option label="文件" value="1" />
                  <el-option label="页面" value="2" />
                  <el-option label="按钮" value="3" />
                  <el-option label="权限" value="4" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="路径">
                <el-input v-model="menuForm.path" maxlength="32" show-word-limit />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="图标">
                <el-input v-model="menuForm.icon" maxlength="20" show-word-limit />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="终端" prop="loginFrom">
                <el-select v-model="menuForm.loginFrom" class="form-item">
                  <el-option label="PC" value="1" />
                  <el-option label="APP" value="2" />
                  <el-option label="通用" value="3" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注">
                <el-input v-model="menuForm.remark" maxlength="32" show-word-limit />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item class="button-item">
                <el-button @click="cancelSubmit()">放 弃</el-button>
                <el-button type="primary" @click="submitForm('menuForm')">提 交</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>

  import { add, del, update, tree } from "@/api/menu";

  export default {
    name: "Menu",
    data() {
      return {
        menuTree: [],
        selectMenuTree: [],
        defaultProps: {
          children: "children",
          label: "name"
        },
        menuForm: {
          id: null,
          pid: null,
          name: "",
          pName: "",
          permission: "",
          type: "",
          path: "",
          icon: "",
          seq: 0,
          loginFrom: "",
          remark: ""
        },
        rules: {
          pid: [{ required: true, message: "请选择上级菜单", trigger: "change" }],
          name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
          seq: [{ required: true, message: "请输排序值", trigger: "blur" }],
          type: [{ required: true, message: "请选择类别", trigger: "change" }],
          loginFrom: [{ required: true, message: "请选择终端", trigger: "change" }],
        },
        loading: false,
        formDisable: true
      }
    },

    mounted() {
      this.getMenuTree();
    },

    methods: {

      /**
       * 获取菜单树
       */
      getMenuTree() {
        this.loading = true;
        tree()
          .then(res => {
            this.menuTree = res.data.children;
            this.selectMenuTree = [];
            let rootTree = {
              id: 0,
              name: "根目录",
              children: this.menuTree
            };
            this.selectMenuTree.push(rootTree);
            this.loading = false;
          })
          .catch(() => {
          })
      },

      /**
       * 点击树节点，
       * 将菜单信息传入表单中
       * 如果是编辑状态，设为不可编辑
       * @param data 部门信息
       */
      handleNodeClick(data) {
        this.menuForm = {
          id: data.id,
          pid: data.pid,
          name: data.name,
          pName: data.pName,
          seq: data.seq,
          permission: data.permission,
          type: data.type,
          path: data.path,
          icon: data.icon,
          loginFrom: data.loginFrom,
          remark: data.remark
        }
        if (this.formDisable) {
          return;
        }
        this.formDisable = true;
      },

      /**
       * 下拉选择部门，
       * @param data 部门信息
       */
      chooseMenu(data) {
        this.menuForm.pid = data.id;
        if (this.menuForm.pid === 0) {
          this.menuForm.pName = "根目录";
        } else {
          this.menuForm.pName = data.name;
        }
        this.$refs.menu_select.visible = false;
      },

      /**
       * 重置表单数据
       */
      resetMenuForm() {
        this.menuForm = {
          id: null,
          pid: null,
          name: "",
          pName: "",
          permission: "",
          type: "",
          path: "",
          icon: "",
          seq: 0,
          loginFrom: "",
          remark: ""
        }
      },

      /**
       * 新增操作
       */
      handleAdd() {
        this.resetMenuForm();
        this.formDisable = false;
      },

      /**
       * 编辑操作
       */
      handleEdit() {
        if (this.menuForm.id) {
          this.formDisable = false;
        } else {
          this.$message({
            type: "warning",
            message: "请选择要编辑的菜单！"
          });
        }
      },

      /**
       * 删除菜单
       */
      handleDel() {
        if (!this.menuForm.id) {
          this.$message({
            type: "warning",
            message: "请选择要编辑的菜单！"
          });
          return;
        }
        this.$confirm(`确定删除菜单 ${this.menuForm.name} 吗？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          del(this.menuForm.id)
            .then(() => {
              this.$message({
                type: "success",
                message: "删除成功！"
              });
              this.resetMenuForm();
              this.getMenuTree();
            })
            .cache(() => {
            })
        }).catch(() => {
        })
      },

      /**
       * 放弃提交
       */
      cancelSubmit() {
        this.resetMenuForm();
        this.formDisable = true;
      },

      /**
       * 提交表单
       * @param formName 表单名称
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.menuForm.id) {
              this.editMenu();
            } else {
              this.addMenu();
            }
          }
        });
      },

      /**
       * 新增菜单
       */
      addMenu() {
        add(this.menuForm)
          .then(() => {
            this.$message({
              type: "success",
              message: "新增成功！"
            });
            this.getMenuTree();
            this.resetMenuForm();
            this.formDisable = true;
          })
          .catch(() => {
          })
      },

      /**
       * 编辑菜单
       */
      editMenu() {
        update(this.menuForm)
          .then(() => {
            this.$message({
              type: "success",
              message: "编辑成功！"
            });
            this.getMenuTree();
            this.formDisable = true;
          })
          .catch(() => {
          })
      }

    }

  }
</script>

<style scoped>
  .form-item {
    width: 100%;
  }

  .button-item {
    text-align: right;
  }

  .tree-option {
    width: 100%;
    height: auto;
    padding: 10px;
  }
</style>
