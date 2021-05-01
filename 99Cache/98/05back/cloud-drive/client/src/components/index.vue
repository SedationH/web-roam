<template>
  <div class="index">
    <div class="title">
      在线网盘系统
    </div>
    <div class="label">
      Cloud Driver
    </div>
    <div class="btn">
      <el-button type="primary" @click="dialogFormVisible = true"
        >登录/注册</el-button
      >
    </div>
    <el-dialog
      title="登录/注册"
      :visible.sync="dialogFormVisible"
      width="400px"
    >
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input
            v-model="form.password"
            autocomplete="off"
            type="password"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="signUp">注 册</el-button>
        <el-button type="primary" @click="signIn">登 录</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      dialogFormVisible: false,
      form: {
        username: "",
        password: ""
      },
      formLabelWidth: "100px"
    };
  },
  methods: {
    // 登录
    signIn() {
      this.dialogFormVisible = false;
      this.$http
        .post("/user/validate", this.form)
        .then(res => {
          if (res.data.flag === 0) {
            this.$message.error(res.data.msg);
          } else {
            this.$message.success(res.data.msg);
            sessionStorage.setItem("uid", res.data.uid);
            sessionStorage.setItem("username", res.data.username);

            //  跳转到其他页面
            this.$router.push("tab-list");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //  注册
    signUp() {
      this.dialogFormVisible = false;
      this.$http
        .post("/user/add", this.form)
        .then(res => {
          if (res.data.flag === 0) {
            this.$message.error(res.data.msg);
          } else {
            this.$message.success(res.data.msg);
            this.$router.push("tab-list");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.index {
  margin-top: 80px;
  text-align: center;
}
.title {
  font-size: 60px;
}
.label {
  font-size: 40px;
  margin-top: 10px;
}
.btn {
  margin-top: 10px;
}
.dialog-footer {
  text-align: center;
}
</style>
