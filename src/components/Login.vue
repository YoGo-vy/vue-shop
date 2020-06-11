<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="sign_box">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="80px"
        class="login_form"
      >
        <el-form-item prop="username" label="用户名">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <el-form class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetFrom()">重置</el-button>
        </el-form>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  // component 组件数据模型
  data: function() {
    return {
      // 表单数据
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 验证规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 2,
            max: 6,
            message: '用户名长度为2~6个字符',
            trigger: 'change'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度为6~16位', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    resetFrom: function() {
      // 重置form表单：restFields()
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        //  false：验证失败，直接return结束后面axios代码执行
        if (!valid) return console.log('验证失败，阻止axios请求')
        //  验证成功，发送axios请求
        const { data: res } = await this.$http.post('login', this.loginForm)
        // 获取axios返回数据，不能直接过去PromiseValue
        // 异步函数方式 + 对象结构赋值
        if (res.meta.status !== 200) {
          // 登录失败，直接返回结束
          return this.$message.error({ message: res.meta.msg, showClose: true })
        }
        this.$message.success(res.meta.msg)
        // 登录成功：1.记录token用于识别登录状态；2.编程式导航跳转主页
        sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 6px;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .sign_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    box-sizing: border-box;
    padding: 10px;
    img {
      width: 100%;
      background-color: #eee;
      border-radius: 50%;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 10px;
  width: 100%;
  padding: 0 25px 15px 15px;
  box-sizing: border-box;
}
 .btns {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
  }
</style>
