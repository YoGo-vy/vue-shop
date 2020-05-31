<template>
    <div class="rights">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/homme' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- Card卡片 -->
        <el-card>
            <!-- 展示所有权限列表 -->
            <el-table
            :data="rightsList"
            :border="true"
            :stripe="true"
            style="width: 100%">
                <el-table-column
                type="index">
                </el-table-column>
                <el-table-column
                    prop="authName"
                    label="权限说明">
                </el-table-column>
                <el-table-column
                    prop="path"
                    label="对应访问路径">
                </el-table-column>
                <el-table-column
                    prop="level"
                    label="权限层级">
                    <!-- 组件插槽：根据当前的等级显示对应的tag标签 -->
                    <template slot-scope="slotprops">
                        <div>
                            <el-tag v-if="slotprops.row.level ==='0'">一级</el-tag>
                            <el-tag type="info" v-else-if="slotprops.row.level==='1'">二级</el-tag>
                            <el-tag type="danger" v-else>三级</el-tag>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

        </el-card>
    </div>
</template>
<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightsList = res.data
    }
  }

}
</script>
<style lang="less" scoped>

</style>
