<template>
    <div>
        <!-- 面包屑导航 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
         <!-- 卡片主体内容 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表table -->
            <el-table
                :data="rolesList"
                border
                :stripe="true"
                style="width: 100%">

                <!--
                    列表展开行：从当前行信息展开(作用域插槽)
                        一级权限 --占一行
                        二级权限 --占一行
                        三级权限 --多个el-tag标签
                -->
                <el-table-column type="expand">
                    <template slot-scope="slotprops">
                        <div>
                            <el-row :class="['bdbottom',index1 ===0 ? 'bdtop':'','vcenter']" v-for="(item1, index1) in slotprops.row.children" :key="index1">
                                <!-- 渲染一级权限 -->
                                <el-col :span="6">
                                    <el-tag closable @close="deleteRights(slotprops.row,item1.id)" type="primary">{{item1.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <!-- 渲染二级和三级权限 -->
                                <el-col :span="18">
                                    <!-- 二级权限 -->
                                    <el-row type="flex" justify="center" :class="[index2 === 0? '':'bdtop','vcenter']" v-for="(item2, index2) in item1.children" :key="index2">
                                        <el-col :span="8">
                                            <el-tag closable @close="deleteRights(slotprops.row,item2.id)" type="warning">{{item2.authName}}</el-tag>
                                            <i class="el-icon-caret-right"></i>
                                        </el-col>
                                        <!-- 三级权限 -->
                                        <el-col :span="16">
                                            <el-tag closable @close="deleteRights(slotprops.row,item3.id)" type="danger" v-for="(item3, index3) in item2.children" :key="index3">
                                                {{item3.authName}}
                                            </el-tag>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column type="index"></el-table-column>
                <el-table-column
                prop="roleName"
                label="角色名称">
                </el-table-column>
                <el-table-column
                prop="roleDesc"
                label="角色描述">
                </el-table-column>
                <el-table-column
                width="300"
                label="操作">
                   <template slot-scope="slotprops">
                       <div>
                        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button size="mini" type="warning"
                        @click="open_setRightsDialog(slotprops.row)"
                        icon="el-icon-setting">分配权限</el-button>
                       </div>
                   </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 分配权限对话框 -->
        <el-dialog
            title="分配权限"
            :visible.sync="setRights_dialogVisible"
            width="30%"
            @close="close_setRightsDialog()">
            <!-- Tree树状控件,需指定数据源，数据源树状嵌套关系 -->
            <el-tree :data="rightsList"
            :props="rightsList_Props"
            node-key="id"
            :default-checked-keys="defaultKeys"
            :default-expand-all='true'
            :show-checkbox='true'
            ref="setRightsTreeRef">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="close_setRightsDialog()">取 消</el-button>
                <el-button type="primary" @click="setRights()">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>
<script>
export default {
  data() {
    return {
      rolesList: [],
      setRights_dialogVisible: false,
      rightsList: [],
      rightsList_Props: {
        children: 'children',
        label: 'authName'
      },
      // 当前角色的所有权限列表的key
      defaultKeys: [],
      // 当前角色的id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
    },
    async deleteRights(role, rightId) {
      // 提示用户是否删除
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (result !== 'confirm') return this.$message.info('已取消操作')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 删除成功：更新最新数据，提示信息，保持展开行打开
      this.$message.success(res.meta.msg)
      /*
      该方式更新数据后，重新渲染页面，展开行默认关闭
            this.getRolesList()
      直接赋值给slotprops：
          组件的数据模型也改变--作用域插槽slotprops和table数据双向绑定
      */
      role.children = res.data
    },

    /*
      点击按钮，打开Dialog窗口，渲染Tree树状权限列表
        1.获取所有rights,初始化tree树形节点
        2.获取当前角色的所有rights权限
        3.获取当前角色的所有rights权限的key数组赋值组件数据模型，实现已有权限选定
    */
    async open_setRightsDialog(role) {
      // 1.获取所有权限列表
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightsList = res.data
      // 2.通过作用域插槽slotprops.row获取当前role角色的权限数据
      this.roleId = role.id
      // 3.获取当前角色的key数组,初始化到组件数据模型
      this.getKeys(role, this.defaultKeys)
      this.setRights_dialogVisible = true
    },
    // 使用递归，根据角色数据获取角色的权限的id数组
    getKeys(data, arr) {
      // 判断是否为第三级权限，是否含有children属性
      if (!data.children) {
        // return:如果没有children属性，结束当前递归，否则data.children.forEach()数组下表越界
        return arr.push(data.id)
      }
      data.children.forEach(item => {
        this.getKeys(item, arr)
      })
    },

    // 1.点击取消设置：关闭配置权限对话框，清空默认选中的keys数组
    // 2.为Dialog添加close事件，监听窗口关闭后也进行重置清空当前角色的默认数据
    close_setRightsDialog() {
      this.setRights_dialogVisible = false
      this.roleId = ''
      this.defaultKeys = []
    },
    // 点击确认设置：配置权限，关闭Dialog；清空默认选中的Keys数组
    async setRights() {
      // 配置权限：参数:roleId，rights权限 ID 列表（字符串）
      // 获取rights字符串,展开符号进行数组合并,join()方法进行拼接
      const arr1 = this.$refs.setRightsTreeRef.getCheckedKeys()
      const arr2 = this.$refs.setRightsTreeRef.getHalfCheckedKeys()
      const strRights = [...arr1, ...arr2].join(',')
      //  配置权限
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: strRights
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg + res.meta.status)
      // 配置成功：提示成功；获取最新的rolesLIst；清空默认Keys，roleId；关闭对话框
      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.setRights_dialogVisible = false
    }
  }
}

</script>
<style lang="less" scope>
.el-row {
    padding: 10px 0;
}
.bdbottom {
    border-bottom: 1px solid #ccc;
}
.bdtop {
    border-top: 1px solid #ccc;
}
.el-tag{
    margin: 5px;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>
