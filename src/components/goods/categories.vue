<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图：商品分类主体信息 -->
        <el-card>
            <!-- 添加按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="open_addCateDialog()">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格：商品分类 -->
            <tree-table
            :data="cateList"
            :columns="columnsProps"
            :show-index="true"
            border
            :selection-type="false"
            :expand-type="false"
            index-text="#">
            <!-- tree-table内使用具名插槽 ，使用作用域插槽接收tree-table传递的参数-->

                <!-- 是否有效 -->
                <template slot="cat_deleted" slot-scope="slotprops">
                    <div>
                        <i class="el-icon-success" v-if="slotprops.row.cat_deleted" style="color:green"></i>
                        <i class="el-icon-error" v-else style="color:red"></i>
                    </div>
                </template>

                 <!-- 分类等级 -->
                <template slot="cat_level" slot-scope="scope">
                    <div>
                        <el-tag size="mini" v-if="scope.row.cat_level==0">一级</el-tag>
                        <el-tag size="mini" v-else-if="scope.row.cat_level==1">二级</el-tag>
                        <el-tag size="mini" v-else>三级</el-tag>
                    </div>
                </template>

                <!-- 操作 -->
                <template slot="handle">
                    <div>
                        <el-button size="mini" type="primary" icon="el-icon-setting">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                    </div>
                </template>
            </tree-table>

            <!-- 分页条 -->
             <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 8, 12]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>

        <!-- 商品分类Dialog -->
        <el-dialog
        title="添加分类"
        :visible.sync="addCate_dialogVisible"
        width="36%"
        @close="close_addCateDialog()">
        <el-form ref="addCateFormRef"
        :model="addCateForm"
        label-width="80px"
        :rules="addCateFormRules">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="分类等级">
            <!-- 分类等级使用联级组件el-Cascader  -->
                <el-cascader
                    v-model="selectLevel"
                    :options="levleList"
                    :props="cascaderProps"
                    @change="handleChange"
                    clearable
                    change-on-select>
                </el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addCate_dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate()">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  data() {
    return {
      // 默认的分页查询信息
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 8
      },
      total: 0,
      cateList: [],
      // tree-table每列的配置信息props
      columnsProps: [{
        label: '商品分类',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        prop: 'cat_deleted',
        // 开启具名插槽
        type: 'template',
        // 使用指定的具名插槽
        template: 'cat_deleted'
      },
      {
        label: '分类等级',
        prop: 'cat_level',
        type: 'template',
        template: 'cat_level'
      },
      {
        label: '操作',
        type: 'template',
        template: 'handle'
      }],

      //  商品分类dialog
      addCate_dialogVisible: false,

      //   商品分类Form的数据模型,
      //   默认添加一级分类：父分类id为0，level为0
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      //   联级选择框数据模型
      levleList: [],
      //   级联框显示的属性设置
      cascaderProps: {
        //   鼠标悬停展开
        expandTrigger: 'hover',
        //   显示的属性
        label: 'cat_name',
        // 选中的值
        value: 'cat_id',
        // 级联数据的关系
        children: 'children'
      },
      //   级联选择框选中等级【数组形式】
      selectLevel: []

    }
  },

  created() {
    this.getCateList()
  },

  methods: {
    // 商品分类数据列表（需要分页显示，携带分页信息参数）
    //  注意：get和delete请求方式，以对象形式传递参数，需要使用params方式传递
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data.result
      this.total = res.data.total
    },

    // 每页显示页码大小发生改变
    sizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getCateList()
    },

    // 当前页码发生改变
    currentChange(pagenum) {
      this.queryInfo.pagenum = pagenum
      this.getCateList()
    },
    // 打开添加分类：获取所有1.2级分类，以渲染联级选择框分类
    async open_addCateDialog() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.levleList = res.data
      this.addCate_dialogVisible = true
    },
    /*
    关闭添加分类对话框，
        1.清除对话框数据，
        2.清空级联选择框数据，
        3.清空addCateForm的父分类id，分类等级
      */
    close_addCateDialog() {
      this.$refs.addCateFormRef.resetFields()
      this.selectLevel = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },

    /*
    当联级选择框选中发生改变，
    从数组中获取设置当前分类的：父分类的id,分类等级
    */
    handleChange() {
      // 如果设置1级分类
      if (this.selectLevel.length === 0) {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      } else {
        // 如果设置2,3级分类，父分类id为数组最后一个元素；等级为数组长度
        this.addCateForm.cat_pid = this.selectLevel[this.selectLevel.length - 1]
        this.addCateForm.cat_level = this.selectLevel.length
      }
    },
    // 点击确认，添加分类--必须先进行预验证
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return this.$message.error('分类信息填写错误')
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 添加成功：获取最新的分类数据，关闭清空重置当前Dialog
        this.getCateList()
        this.addCate_dialogVisible = false
      })
    }
  }
}
</script>
<style lang="less" scope>

/* 在ElementUI的2.13.0版本中直接引入级联选择框cascader在浏览器中显示异常，
数据过多时级联选择框弹出来的panel高度占满浏览器，
global.css中添加.el-cascader-panel{ height: xxxpx }即可解决此问题。
 */

.el-cascader {
    width: 100%;
}
</style>
