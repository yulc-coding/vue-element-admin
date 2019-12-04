<template>
  <div class="user-box">
    <el-row>
      <el-col :span="24">
        <div class="tool-box">
          <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="handleAdd">新增</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="mulDelete">批量删除</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table :data="users" @selection-change="selectChange" style="width: 100%" v-loading="loading" stripe>
      <el-table-column type="selection" width="55" prop="id" />
      <el-table-column prop="username" label="账号" width="180" />
      <el-table-column prop="name" label="姓名" width="180" />
      <el-table-column prop="depName" label="部门" width="180" />
      <el-table-column prop="phone" label="电话" width="180" />
      <el-table-column prop="state" label="状态" width="180" />
      <el-table-column prop="remark" label="备注" show-overflow-tooltip />
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog
      :title="dialogTitle"
      width="700px"
      :visible.sync="userFormVisible"
      @close="resetForm('userForm')"
    >
      <div class="dialog-all">
        <div class="dialog-left">
          <el-form :model="user" :rules="rules" ref="userForm">
            <el-form-item label="姓名" prop="name" label-width="50px">
              <el-input v-model="user.name" maxlength="10" show-word-limit />
            </el-form-item>
            <el-form-item label="账号" label-width="50px">
              <el-input v-model="user.username" maxlength="10" show-word-limit />
            </el-form-item>
            <el-form-item label="部门" label-width="50px">
              <el-input v-model="user.depCode" />
            </el-form-item>
            <el-form-item label="手机" label-width="50px">
              <el-input v-model="user.phone" maxlength="11" show-word-limit />
            </el-form-item>
            <el-form-item label="性别" label-width="50px">
              <el-input v-model="user.gender" />
            </el-form-item>
            <el-form-item label="备注" label-width="50px">
              <el-input v-model="user.remark" maxlength="25" show-word-limit />
            </el-form-item>
          </el-form>
        </div>
        <div class="dialog-right">
          <el-upload
            class="avatar-uploader"
            :action="avatarAction"
            :data="avatarParam"
            name="avatar"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="avatarPath" :src="avatarPath" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUser('userForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getInfo, page } from '@/api/user';

  export default {
    data() {
      return {
        users: [],
        user: {
          id: null,
          name: "",
          username: "",
          depCode: "",
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
        avatarParam: {},
        userBackup: Object.assign({}, this.user),
        multipleSelection: [],
        userFormVisible: false,
        dialogTitle: "",
        rowIndex: 9999,
        rules: {
          name: [
            { required: true, message: "请输入姓名", trigger: "blur" },
            { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
          ]
        }
      };
    },

    mounted() {
      this.userPage();
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
       * 分页
       */
      userPage() {
        this.loading = true;
        page({
          "page": this.page,
          "size": this.size
        })
          .then(res => {
            console.log(res);
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
       * 获取明细
       */
      userDetail(userId) {
        getInfo(userId)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.error(err);
          });
      },

      /**
       * 编辑
       * @param index
       * @param row
       */
      handleEdit(index, row) {
        this.dialogTitle = "编辑";
        this.user = Object.assign({}, row);
        this.userFormVisible = true;
        this.rowIndex = index;
      },

      /**
       * 提交表单
       * @param formName
       */
      submitUser(formName) {
        // 表单验证
        this.$refs[formName].validate(valid => {
          if (valid) {
            let id = this.user.id;
            if (id) {
              // id非空-修改
              this.users.splice(this.rowIndex, 1, this.user);
            } else {
              // id为空-新增
              this.user.id = this.users.length + 1;
              this.users.unshift(this.user);
            }
            this.userFormVisible = false;
            this.$message({
              type: "success",
              message: id ? "修改成功！" : "新增成功！"
            });
          }
        });
      },

      /**
       * 删除单条
       * @param index
       * @param row
       */
      handleDelete(index, row) {
        this.$confirm(`确定删除用户 【${row.name}】 吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.users.splice(index, 1);
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          })
          .catch(() => {
            console.log("取消删除");
          });
      },

      /**
       * 重置表单
       * @param formName
       */
      resetForm(formName) {
        this.$refs[formName].clearValidate();
      },

      /**
       * 批量删除
       */
      mulDelete() {
        let len = this.multipleSelection.length;
        if (len === 0) {
          this.$message({
            type: "warning",
            message: "请至少选择一项！"
          });
        } else {
          this.$confirm(`确定删除选中的 ${len} 个用户吗？`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.$message({
                type: "success",
                message: `成功删除了${len}条数据！`
              });
            })
            .catch(() => {
              console.log("取消删除");
            });
        }
      },
      selectChange(val) {
        this.multipleSelection = val;
      },

      /**
       * 新增
       */
      handleAdd() {
        this.dialogTitle = "新增";
        this.user = Object.assign({}, this.userBackup);
        this.userFormVisible = true;
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
        if (this.user.id) {
          // 赋值参数
          this.avatarParam = {
            id: this.user.id
          }
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
      },

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

  /* 上传头像相关 */
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
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
</style>
