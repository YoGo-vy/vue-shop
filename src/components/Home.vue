<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div class="logo">
        <img src="../assets/heima.png" alt />
        <h2>电商后台管理系统</h2>
      </div>
      <el-button @click="logout" type="info" round>退出</el-button>
    </el-header>
    <el-container class="content">

      <!-- 侧边栏aside -->
      <el-aside :width="isCollapse? '64px':'200px'">
        <!-- 按钮：控制菜单栏折叠和展开 -->
        <div class="toggle_button" @click="collapse()">|||</div>

        <!-- 侧边栏分组内容 start-->
        <el-menu
          :collapse="isCollapse"
          :collapse-transition="false"
          :unique-opened="true"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :default-active="ativePath"
          :router='true'
        >
        <!-- saveAtivePath -->
          <!-- 一级菜单 -->
          <!--  :index="item.id" :index接受字符串类型，属性绑定为原对应类型 -->
          <el-submenu :index="item.id+''" v-bind:key="item.id" v-for="(item) in menuList">
            <template slot="title">
              <!-- 动态设置一级图标：一级列表的id（Number类型） -->
              <i :class="iconObj[item.id+'']"></i>
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 menu已经开启路由模式，以二级菜单的index作为路由连接-->
            <el-menu-item @click="saveAtivePath('/'+subitem.path)" :index="'/'+subitem.path" :key="subitem.id" v-for="subitem in item.children">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <!-- 侧边栏分组内容 end -->
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data: function() {
    return {
      isCollapse: false,
      ativePath: '',
      menuList: [],
      // 设置一级菜单的不同图标,以对象的属性方式
      iconObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      }
    }
  },
  // created生命周期函数：获取当前Home组件数据模型
  created: function() {
    this.getMenulist()
    // 获取当前被记录的被点击高亮的菜单标识
    this.ativePath = sessionStorage.getItem('ative_Path')
  },
  methods: {
    logout: function() {
      // 退出---删除登录token，编程式导航跳转到login页面
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getMenulist: async function() {
      // 获取memu列表信息,结构赋值，初始化组件数据模型
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.menuList = res.data
    },
    collapse: function() {
      this.isCollapse = !this.isCollapse
    },
    saveAtivePath: function(path) {
      // 1.动态设置当前点击菜单高亮显示，2.保存当前菜单标识，刷新页面记录当前菜单任然高亮显示
      this.ativePath = path
      sessionStorage.setItem('ative_Path', path)
    }
  }
}
</script>

<style lang="less" scope>
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;

  background-color: #353b3d;
  height: 10% !important;
}
.logo img {
  vertical-align: middle;
}
.logo h2 {
  display: inline-block;
  color: #e1e5e8;
  margin-left: 10px;
}

.el-aside {
  background-color: #303541;
  .toggle_button {
    background-color: #4a5064;
    height: 36px;
    line-height: 36px;
    color: #fff;
    text-align: center;
  }
  .el-menu {
    border-right: 0;
  }
}
.iconfont {
  margin-right: 10px;
}
.el-main {
  background-color: #e1e5e8;
}
</style>
