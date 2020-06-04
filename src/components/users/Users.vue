<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div style="margin-top: 15px;">
        <el-row :gutter='15'>
          <el-col :span="8">
            <!-- 输入框可清空，清空事件重新查询接口数据展示 -->
            <el-input v-model="queryInfo.query" placeholder="请输入内容" :clearable="true" @clear="getUserlist">
              <el-button slot="append" icon="el-icon-search" @click="getUserlist"></el-button>
            </el-input>
          </el-col>

          <el-col :span="3">
            <el-button class="search_button" type="primary" round @click="add_dialogVisible=true">添加用户</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 用户列表展示 -->
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="role_name" label="角色">
        </el-table-column>

        <el-table-column prop="mg_state" label="状态">
          <!-- 作用域插槽,el-table-column组件传递数据给el-switch组件 -->
          <template slot-scope="slotProps">
            <el-switch v-model="slotProps.row.mg_state" @change="userstateChanged(slotProps.row)" active-text="开启">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180">
          <!-- 作用域插槽 传递当前行的id等数据；【修改删除操作携带的当前数据信息】 -->
          <template slot-scope="slotprops">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="fintUser(slotprops.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delectUser(slotprops.row)"></el-button>
            <!-- 按钮添加tooltip提示工具 -->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="open_setRoleDialog(slotprops.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
         @size-change="handleSizeChange"
        :page-sizes="[1, 3, 5]"
        :page-size="queryInfo.pagesize"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="add_dialogVisible"
        width="36%"
        @close="reset_addUserForm" >
        <el-form :model="adduserForm" :rules="rules" ref="adduserFormRef"
        label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="adduserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="adduserForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="adduserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="adduserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="add_dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户信息对话框 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="edit_dialogVisible"
        width="36%"
        @close="reset_editUserForm">
        <el-form ref="edituserFormRef" :rules="rules"
        :model="editUserForm" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editUserForm.username" disabled=""></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email" ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editUserForm.mobile" ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="edit_dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 为用户更改角色对话框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisible"
        width="30%"
        @close="close_setRoleDialog()">
        <span>当前用户 : {{current_User.username}}</span>
        <hr>
        <span>当前角色 : {{current_User.role_name}}</span>
        <hr>
        <span>分配新角色</span>
        <!-- 下拉框选项组件 -->
        <el-select v-model="roleID" placeholder="选择角色">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
            :disabled="item.id === roleID? true:false">
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRole()">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data: function() {
    /*
      自定义Email和Mobile的校验规则
         1.在函数内定义验证规则常量；组件内数据的规则内使用
         2.区别于return返回的是组件数据
     */
    const checkEmail = function(rule, value, callback) {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (!regEmail.test(value)) return callback(new Error('邮箱不合法'))
      callback()
    }
    const checkMobile = function(rule, value, callback) {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (!regMobile.test(value)) return callback(new Error('手机号不合法'))
      callback()
    }

    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 3
      },
      total: 0,
      userList: [],
      add_dialogVisible: false,
      // 添加用户的数据模型和规则
      adduserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''

      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 6, message: '用户名长度为2~6个字符' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度为6~16位', trigger: 'change' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入绑定手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]

      },
      // 修改用户弹窗
      edit_dialogVisible: false,
      editUserForm: {},
      // 为用户分配角色弹窗
      setRoleDialogVisible: false,
      // 角色列表
      rolesList: [],
      roleID: '',
      current_User: {}

    }
  },
  created: function() {
    this.getUserlist()
  },
  methods: {
    getUserlist: async function() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 当前页改变,设置queryInfo的当前页--重新从接口获取数据
    handleCurrentChange: function(currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getUserlist()
    },
    // 每页显示条数改变，设置queryInfo的显示条数--重新从接口获取数据
    handleSizeChange: function(pageSize) {
      this.queryInfo.pagesize = pageSize
      this.getUserlist()
    },
    userstateChanged: async function(row) {
      // 修改后台用户状态
      const { data: res } = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      if (res.meta.status !== 200) {
        // 如果设置失败，提示消息，返回switch状态为原状态
        // 恢复switch状态：v-model双向数据绑定
        row.mg_state = !row.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 关闭addUser的Dialog，清空form表单数据（包括提交时的关闭）
    reset_addUserForm: function() {
      this.$refs.adduserFormRef.resetFields()
    },
    // 发送添加用户请求:提交前预验证
    addUser: function() {
      /*  虽然validate()返回类型为promise对象，但是使用异步方式会报错
            正确---参数为函数，
      const res = await this.$refs.adduserFormRef.validate()
      console.log(res)
       */
      this.$refs.adduserFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('信息输入有误')
        // 验证通过
        const { data: res } = await this.$http.post('users', this.adduserForm)
        if (res.meta.status !== 200) this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 关闭Dialog,获取最新的数据，提示添加成功
        this.add_dialogVisible = false
        this.getUserlist()
        this.$message.success(res.meta.msg)
      })
    },
    // 点击修改按钮根据ID查询当前用户
    fintUser: async function(row) {
      const { data: res } = await this.$http.get('users/' + row.id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editUserForm = res.data
      // 打开edit的dialog
      this.edit_dialogVisible = true
    },
    // 关闭窗口，重置edit的Dialog页面的信息
    reset_editUserForm: function() {
      this.$refs.edituserFormRef.resetFields()
    },
    // 修改dialog窗口提交数据:预验证后提交
    editUser: function() {
      this.$refs.edituserFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('信息填写有误')
        const { data: res } = await this.$http.put('users/' + this.editUserForm.id, {
          email: this.editUserForm.email,
          mobile: this.editUserForm.mobile
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 修改成功：关闭Dialog窗口，重新获取最新的数据，提示修改成功
        this.getUserlist()
        this.edit_dialogVisible = false
        this.$message.success(res.meta.msg)
      })
    },
    delectUser: async function(row) {
      // 弹框提示是否确认删除   ---MessageBox组件的confirm函数
      /*
      confirm:
            点击确认：.then ---获取"confirm"执行结果
            点击取消：.catch---获取"cancle"错误对象（点击取消会报错需要catch获取错误对象）
        使用async await异步函数直接获取：
              执行结果---直接获取
              错误对象---直接获取【使用catch链式编程，return返回给接受值】

      */
      const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (result !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('users/' + row.id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 删除成功:获取最新的userlist；提示删除信息
      this.getUserlist()
      this.$message.success(res.meta.msg)
    },
    // 打开分配角色Dialog，先获取所有角色
    async open_setRoleDialog(user) {
      // 设置当前用户数据
      this.current_User = user
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    // 取消分配权限:清空分配角色的当前选择
    close_setRoleDialog() {
      this.current_User = {}
      this.roleID = ''
    },
    // 确认分配权限--参数：当前用户id，设置的角色id
    async setRole() {
      /* 判断提交前是否为空，为null则不允许提交 */
      if (!this.roleID) return this.$message.info('尚未选择角色')
      const { data: res } = await this.$http.put(`users/${this.current_User.id}/role`, {
        rid: this.roleID
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getUserlist()
      this.setRoleDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.search_button {
  margin-left: 5px;
}

</style>
