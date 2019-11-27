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
    <el-table :data="users" @selection-change="selectChange" style="width: 100%">
      <el-table-column type="selection" width="55" prop="id" />
      <el-table-column sortable prop="username" label="账号" width="180" />
      <el-table-column prop="name" label="姓名" width="180" />
      <el-table-column prop="depName" label="部门" width="180" />
      <el-table-column prop="phone" label="电话" width="180" />
      <el-table-column prop="state" label="状态" width="180" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :page-sizes="[10, 20, 30, 50]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
    >
    </el-pagination>
    <el-dialog
      :title="dialogTitle"
      width="600px"
      :visible.sync="userFormVisible"
      @close="resetForm('userForm')"
    >
      <el-form :model="user" :rules="rules" ref="userForm">
        <el-form-item label="姓名" prop="name" label-width="50px">
          <el-input v-model="user.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="手机" label-width="50px">
          <el-input v-model="user.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="地址" label-width="50px">
          <el-input v-model="user.address" autocomplete="off" />
        </el-form-item>
        <el-form-item label="日期" label-width="50px">
          <el-date-picker
            v-model="user.date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" label-width="50px">
          <el-switch
            v-model="user.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
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
          id: "",
          date: "",
          name: "",
          phone: "",
          address: "",
          status: 0
        },
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
       * 分页
       */
      userPage() {
        page({
          "page": 1,
          "size": 10
        })
          .then(res => {
            console.log(res);
            this.users = res.data.records;
          })
          .catch(err => {
            console.error(err);
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
</style>
