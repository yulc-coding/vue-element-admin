<template>
  <div class="user-box">
    <el-row>
      <el-col :span="24">
        <div class="tool-box">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">新增</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="mulDelete">批量删除</el-button>
          <el-button type="warning" icon="el-icon-connection" size="small" @click="handleBindRole">绑定角色</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table :data="users" @selection-change="selectChange" style="width: 100%" v-loading="loading" stripe>
      <el-table-column type="selection" width="50" prop="id" />
      <el-table-column prop="username" label="账号" width="100" />
      <el-table-column prop="name" label="姓名" width="150" />
      <el-table-column prop="depName" label="部门" width="150" />
      <el-table-column prop="phone" label="电话" width="120" />
      <el-table-column prop="state" label="状态" width="80" />
      <el-table-column prop="remark" label="备注" show-overflow-tooltip />
      <el-table-column label="操作" fixed="right" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
          <el-button size="mini" type="warning" plain @click="handleResetPwd(scope.row)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="size"
      :current-page="page"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 用户新增修改 -->
    <el-dialog
      :title="dialogTitle"
      width="700px"
      :visible.sync="userFormVisible"
      :close-on-click-modal="false"
      @close="resetDialog()"
    >
      <div class="dialog-all">
        <!-- 用户表单 -->
        <div class="dialog-left">
          <el-form :model="user" :rules="rules" ref="userForm" label-width="50px">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="user.name" maxlength="10" show-word-limit />
            </el-form-item>
            <el-form-item label="账号" prop="username">
              <el-input v-model="user.username" maxlength="10" show-word-limit />
            </el-form-item>
            <el-form-item label="部门" prop="depCode">
              <el-select
                ref="dep_select"
                v-model="user.depCode"
                :value-key="user.depCode"
                filterable
                :filter-method="filterSelect"
                class="form-item"
              >
                <el-option :value="user.depCode" :label="user.depName" class="tree-option">
                  <el-tree
                    ref="dep_tree"
                    :data="treeData"
                    :props="defaultProps"
                    default-expand-all
                    :expand-on-click-node="false"
                    :filter-node-method="filterTree"
                    @node-click="handleTreeNodeClick"
                  />
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="user.phone" maxlength="11" show-word-limit />
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-select v-model="user.gender" placeholder="请选择" class="form-item">
                <el-option value="1" label="男" />
                <el-option value="2" label="女" />
              </el-select>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="user.remark" maxlength="25" show-word-limit />
            </el-form-item>
          </el-form>
        </div>
        <!-- 头像上传 -->
        <div class="dialog-right">
          <el-upload
            class="avatar-uploader"
            :action="avatarAction"
            name="avatar"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="avatarPath" :src="avatarPath" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" >添加头像</i>
          </el-upload>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUser('userForm')" :loading="userLoading">提 交</el-button>
      </div>
    </el-dialog>
    <!-- 角色绑定 -->
    <el-dialog
      title="绑定角色"
      width="500px"
      :close-on-click-modal="false"
      :visible.sync="roleFormVisible"
    >
      <el-form :model="userRoleForm" ref="userRoleForm" label-width="50px">
        <!-- 已存在的角色  -->
        <el-form-item
          v-for="(role, index) in userRoles"
          label="角色"
          :key="role.key"
        >
          <el-input v-model="role.value" class="role-form-item" />
          <el-button icon="el-icon-delete" @click.prevent="removeExistsRole(index)" class="role-form-remove" />
        </el-form-item>
        <!-- 新增的角色  -->
        <el-form-item
          v-for="(roleId, index) in userRoleForm.roleIds"
          label="角色"
          :key="'role' + roleId + index"
        >
          <el-select v-model="userRoleForm.roleIds[index]" @change="chooseRole($event, index)" class="role-form-item">
            <el-option
              v-for="item in roleSelect"
              :key="'role-select' + item.key + index"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
          <el-button v-if="index !== userRoleForm.roleIds.length - 1" icon="el-icon-delete"
                     @click.prevent="removeSelectRole(index)"
                     class="role-form-remove" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="roleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="userBindRole" :loading="bindLoading">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { add, del, delMulti, update, getInfo, page, resetPwd, getUserRoles, bindRole } from "@/api/sys/user";
  import { tree } from "@/api/sys/department";
  import { roleSelect } from "@/api/sys/role";

  export default {
    data() {
      return {
        users: [],
        user: {
          id: null,
          name: "",
          username: "",
          depCode: "",
          depName: "",
          phone: "",
          gender: "",
          remark: "",
          avatar: ""
        },
        page: 1,
        size: 10,
        total: 0,
        loading: false,
        // 头像完整地址
        avatarPath: "",
        // 上传头像请求地址
        avatarAction: process.env.VUE_APP_BASE_API + "/sys/user/uploadAvatar",
        // 上传头像附带参数
        valueTitle: "",
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        multipleSelection: [],
        userLoading: false,
        userFormVisible: false,
        dialogTitle: "",
        rules: {
          name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
          username: [{ required: true, message: "请输入账号", trigger: "blur" }],
          depCode: [{ required: true, message: "请选择部门", trigger: "blur" }],
          gender: [{ required: true, message: "请选择性别", trigger: "blur" }]
        },
        // 角色下拉（K,V）
        roleSelect: [],
        // 用户已有的角色列表（K,V）
        userRoles: [],
        // 角色表单新增的角色ID列表
        userRoleForm: {
          roleIds: [""]
        },
        bindLoading: false,
        roleFormVisible: false
      };
    },

    mounted() {
      this.userPage();
      this.getTree();
      this.getRoleSelect();
    },

    methods: {
      /**
       * 每页显示数量变化
       */
      handleSizeChange(val) {
        this.size = val;
        this.userPage();
      },

      /**
       * 当前页数变化
       */
      handleCurrentChange(val) {
        this.page = val;
        this.userPage();
      },

      /**
       * 用户分页
       */
      userPage() {
        this.loading = true;
        page({
          "page": this.page,
          "size": this.size
        })
          .then(res => {
            const resData = res.data;
            this.users = resData.records;
            this.page = resData.current;
            this.total = resData.total;
            this.loading = false;
          })
          .catch(err => {
            console.error(err);
            this.loading = false;
          });
      },

      /**
       * 获取树
       */
      getTree() {
        tree()
          .then(res => {
            this.treeData = res.data.children;
          })
          .catch(err => {
            console.error(err);
          });
      },

      /**
       * 获取角色下拉
       */
      getRoleSelect() {
        roleSelect()
          .then(res => this.roleSelect = res.data)
          .catch(() => {
          });
      },

      /**
       * 部门下拉过滤
       */
      filterSelect(value) {
        this.$refs.dep_tree.filter(value);
      },

      /**
       * 过滤树节点
       * @param value 输入框的值
       * @param data 具体的数据
       */
      filterTree(value, data) {
        if (!value) {
          return true;
        }
        return data.name.indexOf(value) !== -1;
      },

      /**
       * 选择树节点
       */
      handleTreeNodeClick(data) {
        this.user.depCode = data.code;
        this.user.depName = data.name;
        this.$refs.dep_select.visible = false;
        this.filterSelect("");
      },

      /**
       * 重置dialog
       */
      resetDialog() {
        this.user = {};
        this.avatarPath = "";
      },

      /**
       * 新增
       */
      handleAdd() {
        this.dialogTitle = "新增";
        this.userFormVisible = true;
      },

      /**
       * 编辑
       * @param row
       */
      handleEdit(row) {
        getInfo(row.id)
          .then(res => {
            this.user = res.data;
            if (this.user.avatar) {
              // 头像的完整路径
              this.avatarPath = process.env.VUE_APP_BASE_API + this.user.avatar;
            } else {
              this.avatarPath = "";
            }
            this.dialogTitle = "编辑";
            this.userFormVisible = true;
          })
          .catch(() => {
          });
      },

      /**
       * 新增修改后刷新表格
       * @param id 用来判断修改还是新增
       */
      refreshTable(id) {
        this.userLoading = false;
        this.userFormVisible = false;
        this.$message({
          type: "success",
          message: id ? "修改成功！" : "新增成功！"
        });
        this.userPage();
      },

      /**
       * 提交表单（新增或者修改）
       * @param formName
       */
      submitUser(formName) {
        this.userLoading = true;
        // 表单验证
        this.$refs[formName].validate(valid => {
          if (valid) {
            let id = this.user.id;
            let data = {
              name: this.user.name,
              username: this.user.username,
              depCode: this.user.depCode,
              phone: this.user.phone,
              gender: this.user.gender,
              remark: this.user.remark,
              avatar: this.user.avatar
            };
            if (id) {
              // id非空-修改
              data.id = id;
              update(data)
                .then(() => {
                  this.refreshTable(id);
                })
                .catch(() => {
                });
            } else {
              // id为空-新增
              add(data)
                .then(() => {
                  this.refreshTable();
                })
                .catch(() => {
                });
            }
          } else {
            this.userLoading = false;
          }
        });
      },

      /**
       * 删除单条
       * @param row
       */
      handleDelete(row) {
        this.$confirm(`确定删除用户 【${row.name}】 吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            del(row.id)
              .then(() => {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                // 刷新表格
                this.userPage();
              })
              .catch(() => {
              });
          })
          .catch(() => {
          });
      },

      /**
       * 重置密码
       * @param row
       */
      handleResetPwd(row) {
        this.$confirm(`确定重置用户【${row.name}】的密码吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          resetPwd(row.id)
            .then(() => {
              this.$message({
                type: "success",
                message: "重置密码成功!"
              });
            })
            .catch(() => {
            });
        }).catch(() => {
        });
      },

      /**
       * 选中表格数据
       */
      selectChange(val) {
        let ids = [];
        val.forEach(item => {
          ids.push(item.id);
        });
        this.multipleSelection = ids;
      },

      /**
       * 批量删除
       */
      mulDelete() {
        let len = this.multipleSelection.length;
        if (len === 0) {
          this.$message({
            type: "warning",
            message: "请至少选择一条数据！"
          });
        } else {
          this.$confirm(`确定删除选中的 ${len} 个用户吗？`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              delMulti(this.multipleSelection)
                .then(() => {
                  this.$message({
                    type: "success",
                    message: `成功删除了${len}条数据！`
                  });
                  this.userPage();
                })
                .catch(() => {
                });
            })
            .catch(() => {
            });
        }
      },

      /**
       * 绑定角色界面
       * 单个用户时，先获取当前用户的角色信息
       * 批量绑定时，强制重置所有用户的角色信息
       */
      handleBindRole() {
        let len = this.multipleSelection.length;
        if (len === 0) {
          this.$message({
            type: "warning",
            message: "请至少选择一条数据！"
          });
          return;
        } else if (len === 1) {
          getUserRoles(this.multipleSelection[0])
            .then(res => this.userRoles = res.data)
            .catch(() => {
            })
        } else {
          this.userRoles = [];
        }
        this.userRoleForm.roleIds = [""];
        this.roleFormVisible = true;
      },

      /**
       * 删除已有角色
       * @param index 索引
       */
      removeExistsRole(index) {
        this.userRoles.splice(index, 1);
      },

      /**
       * 删除新增的角色
       * @param index 索引
       */
      removeSelectRole(index) {
        this.userRoleForm.roleIds.splice(index, 1);
      },

      /**
       * 下拉选中角色
       * @param value 最新选中的值
       * @param index 索引
       */
      chooseRole(value, index) {
        // 校验原来的角色
        for (let i = 0, len = this.userRoles.length; i < len; i++) {
          if (this.userRoles[i].key === value) {
            this.userRoleForm.roleIds[index] = "";
            this.$message.error("不能重复选择！");
            return;
          }
        }
        // 校验新增的角色
        for (let i = 0, len = this.userRoleForm.roleIds.length; i < len; i++) {
          if (i === index) {
            continue;
          }
          if (this.userRoleForm.roleIds[i] === value) {
            this.userRoleForm.roleIds[index] = "";
            this.$message.error("不能重复选择！");
            return;
          }
        }
        // 如果是最后一行，则新增一行
        if (index === this.userRoleForm.roleIds.length - 1) {
          this.userRoleForm.roleIds.push("");
        }
      },

      /**
       * 绑定角色
       */
      userBindRole() {
        this.bindLoading = true;
        // 合并角色列表（原来已有的+新增的）
        let roleIds = [];
        this.userRoles.forEach(item => roleIds.push(item.key));
        this.userRoleForm.roleIds.forEach(roleId => {
          if (roleId) {
            roleIds.push(roleId);
          }
        });
        const data = {
          userIds: this.multipleSelection,
          roles: roleIds
        };
        bindRole(data)
          .then(() => {
            this.$message({
              type: "success",
              message: "绑定成功!"
            });
            this.roleFormVisible = false;
            this.bindLoading = false;
          })
          .catch(() => {
          });
      },

      /**
       * 上传前处理
       * @param file
       * @returns {boolean|boolean}
       */
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === "image/png";
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error("只能上传 JPG 或者 PNG 格式");
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
          return false;
        }
        return true;
      },

      /**
       * 上传成功
       * @param res
       */
      handleAvatarSuccess(res) {
        if (res.code === 200) {
          this.user.avatar = res.data;
          // 头像的完整路径
          this.avatarPath = process.env.VUE_APP_BASE_API + res.data;
          this.$message({
            message: "上传成功",
            type: "success"
          });
        } else {
          this.$message.error(res.msg);
        }
      }

    }
  };
</script>

<style scoped>
  .user-box {
    width: 100%;
  }

  .tool-box {
    padding: 10px 10px;
    border-bottom: 1px solid #eee;
  }

  .el-pagination {
    margin-top: 20px;
  }

  /* 表单和头像布局 */
  .dialog-all {
    display: inline-block;
  }

  .dialog-left {
    display: block;
    float: left;
    width: 400px;
  }

  .dialog-right {
    display: block;
    float: right;
    margin-left: 50px;
  }

  /* 下拉树样式 */
  .tree-option {
    height: auto;
    padding: 0;
    font-weight: normal;
  }

  /* 节点的间距 */
  ul li >>> .el-tree .el-tree-node__content {
    height: auto;
  }

  /* 上传头像相关 */
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .form-item {
    width: 100%;
  }

  .role-form-item {
    width: 300px;
  }

  .role-form-remove {
    margin-left: 25px;
  }

</style>
