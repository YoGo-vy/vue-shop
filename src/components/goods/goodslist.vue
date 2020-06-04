<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索、添加 -->
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容"
                    v-model="queryInfo.query" clearable
                    @clear="inputClear()">
                        <el-button @click="inputSearch()" slot="append" icon="el-icon-search">
                        </el-button>
                    </el-input>
                </el-col>
                <el-col :span="16" class="but_add">
                    <el-button @click="addGoods()" type="primary" icon="el-icon-edit">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- 商品列表 -->
            <el-table
            :data="goodsList"
            style="width: 100%"
            border
            stripe>
                <el-table-column
                    label="序号"
                    type="index">
                </el-table-column>
                <el-table-column
                    prop="goods_name"
                    label="商品名称"
                    width="380px">
                </el-table-column>
                <el-table-column
                    prop="goods_price"
                    width="80px"
                    label="商品价格">
                </el-table-column>
                <el-table-column
                    prop="goods_number"
                    width="80px"
                    label="商品数量">
                </el-table-column>
                <el-table-column
                    prop="upd_time"
                    label="更新时间">
                    <!-- 时间格式化：过滤器只能使用插值表达式，或者属性绑定中 -->
                    <template slot-scope="props">
                        <div>
                         {{props.row.upd_time|dateFormat}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="130px">
                    <template slot-scope="props">
                        <div>
                            <el-button @click="open_EditDialog(props.row)" type="primary" size="mini" icon="el-icon-edit"></el-button>
                            <el-button @click="deleteGoods(props.row)" type="danger" size="mini" icon="el-icon-delete"></el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 列表分页 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 8, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            background>
            </el-pagination>
        </el-card>

        <!-- 添加商品组件路由占位符 -->
        <router-view></router-view>

        <!-- 修改商品对话框 -->
        <el-dialog
        title="修改商品"
        :visible.sync="editDialogVisible"
        width="30%"
        @close="close_EditDialog()">
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editGoods()">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 分类查询条件
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },

      // 所有商品列表数据
      goodsList: [],
      total: 0,

      //   控制修改商品对话框显示和隐藏
      editDialogVisible: false
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //   获取所有商品列表数据
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 当前页码改变
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum
      this.getGoodsList()
    },
    // 分页显示大小改变
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getGoodsList()
      const str = '1'
      console.log(str.padStart(2, '0'))
    },
    // 输入框搜索按钮
    inputSearch() {
      this.getGoodsList()
    },
    // 清空输入框
    inputClear() {
      this.getGoodsList()
    },

    // 点击编辑修改按钮，打开编辑对话框
    open_EditDialog(row) {
      this.editDialogVisible = true
    },
    // 关闭编辑对话框
    close_EditDialog() {
    },
    // 提交修改商品弹窗
    editGoods() {

    },

    // 点击删除按钮
    async deleteGoods(row) {
      const result = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((error) => { return error })
      if (result !== 'confirm') return this.$message.error('已取消删除')
      const { data: res } = await this.$http.delete('goods/' + row.goods_id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getGoodsList()
    },

    // 点击按钮，添加商品编程式导航跳转添加路由
    addGoods() {
      this.$router.push('/goods/addgoods')
    }
  }

}
</script>

<style lang="less">

.but_add {
    display: flex;
    justify-content: flex-end;
    padding-right: 26px;
}
.cell {
    text-align: center;
}
</style>
