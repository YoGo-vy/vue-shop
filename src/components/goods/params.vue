<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 警告提示 -->
            <el-alert
                title="注意：只允许为三级分类设置参数"
                type="warning"
                show-icon
                :closable="false">
            </el-alert>

            <!-- 级联选择框 -->
            <el-row class="select">
                <el-col :span="6">
                    <span >选择商品分类： </span>
                </el-col>
                <el-col :span="8">
                    <el-cascader
                    v-model="selectCate"
                    :options="cateList"
                    :props="selectCateProps"
                    @change="selectChange">
                    </el-cascader>
                </el-col>
            </el-row>

            <!-- Tabs标签页 -->
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <!-- 动态参数页 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button size="mini"  @click="addDialogOpen" :disabled="isButDisabled" type="primary" icon="el-icon-edit">添加参数</el-button>
                     <!-- 动态参数表格 -->
                     <el-table
                    :data="paramsData"
                    style="width: 100%"
                    border
                    stripe>
                      <!-- 展开行 -->
                      <el-table-column
                      type="expand"
                      label="详细">
                      <template slot-scope="slotprops">
                        <div>
                          <el-tag closable @close="tagDelete(slotprops.row,index)" v-for="(item,index) in slotprops.row.attr_vals" :key="index">{{item}}</el-tag>
                          <!-- 动态编辑标签 -->
                          <el-input
                            class="input-new-tag"
                            v-if="slotprops.row.inputVisible"
                            v-model="slotprops.row.inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(slotprops.row)"
                            @blur="handleInputConfirm(slotprops.row)"
                          >
                          </el-input>
                          <el-button v-else class="button-new-tag"
                           size="small"
                           @click="showInput(slotprops.row)">
                           + New Tag
                           </el-button>
                        </div>
                      </template>
                      </el-table-column>

                       <el-table-column
                      type="index"
                      label="序号">
                      </el-table-column>
                      <el-table-column
                        prop="attr_name"
                        label="参数名称">
                      </el-table-column>
                      <el-table-column
                        label="操作">
                        <template slot-scope="slotprops">
                          <div>
                            <el-button type="primary" @click="aditAttrDialogOpen(slotprops.row)" size="mini" icon="el-icon-edit">修改</el-button>
                           <el-button type="danger" @click="deleteAttr(slotprops.row)" size="mini" icon="el-icon-delete">删除</el-button>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                </el-tab-pane>

                <!-- 静态属性页 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button @click="addDialogOpen" size="mini" :disabled="isButDisabled" type="primary" icon="el-icon-edit">添加属性</el-button>
                    <!-- 静态属性表格 -->
                    <el-table
                    :data="attrData"
                    style="width: 100%"
                    border
                    stripe>

                    <!-- 展开行 -->
                      <el-table-column
                      type="expand"
                      label="详细">
                      <template slot-scope="slotprops">
                        <div>
                          <el-tag closable @close="tagDelete(slotprops.row,index)" v-for="(item,index) in slotprops.row.attr_vals" :key="index">{{item}}</el-tag>
                          <!-- 动态编辑标签 -->
                          <el-input
                            class="input-new-tag"
                            v-if="slotprops.row.inputVisible"
                            v-model="slotprops.row.inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(slotprops.row)"
                            @blur="handleInputConfirm(slotprops.row)"
                          >
                          </el-input>
                          <el-button v-else class="button-new-tag"
                           size="small"
                           @click="showInput(slotprops.row)">+ New Tag</el-button>
                        </div>
                      </template>
                      </el-table-column>

                       <el-table-column
                      type="index">
                      </el-table-column>
                      <el-table-column
                        prop="attr_name"
                        label="参数名称">
                      </el-table-column>
                      <el-table-column
                        label="操作">
                        <template slot-scope="slotprops">
                          <div>
                            <el-button type="primary" @click="aditAttrDialogOpen(slotprops.row)" size="mini" icon="el-icon-edit">修改</el-button>
                            <el-button type="danger" @click="deleteAttr(slotprops.row)" size="mini" icon="el-icon-delete">删除</el-button>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

        </el-card>

        <!-- 添加【参数、属性】Dialog -->
        <el-dialog
          :title="'添加'+addDialogtitle"
          :visible.sync="addDialogVisible"
          width="30%"
          @close="addDialogClose">
          <el-form ref="addAttrFormRef"
          :rules="addFormRules"
          :model="addAttrForm" label-width="80px">
            <el-form-item :label="addDialogtitle" prop="attr_name">
              <el-input v-model="addAttrForm.attr_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addAttr">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 修改参数Dialog -->
        <el-dialog
          :title="'修改'+addDialogtitle"
          :visible.sync="editdialogVisible"
          width="30%"
          @close="editDialogClose">
          <el-form
          :model="aditAttrForm" :rules="addFormRules"
          ref="aditAttrFormRef" label-width="100px">
            <el-form-item label="活动名称" prop="attr_name">
              <el-input v-model="aditAttrForm.attr_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editAttr">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  data() {
    return {
      // 所有分类数据
      cateList: [],
      // 级联选择框当前选中分类
      selectCate: [],
      // 级联选择框配置
      selectCateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // Tabs标签页切换,可设置默认页
      activeName: 'many',
      //  动态参数数据
      paramsData: [],
      // 静态属性数据
      attrData: [],
      // 控制添加参数属性对话框显示和隐藏
      addDialogVisible: false,
      // 添加属性绑定的数据
      addAttrForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '属性、参数名不能为空', trigger: 'blur' }
        ]
      },
      // 控制修改参数的Dialog显示与隐藏
      editdialogVisible: false,
      aditAttrForm: {
        ttr_id: '',
        attr_name: ''
      },
      // 动态编辑标签绑定数据
      inputValue: ''
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    cateId() {
      return this.selectCate[this.selectCate.length - 1]
    },
    isButDisabled() {
      if (this.selectCate.length !== 3) return true
      return false
    },
    // 添加属性Dialog弹窗的title
    addDialogtitle() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
    },

    // 级联选择框选中改变,获取当前分类、当前tab页的参数属性数据
    selectChange() {
      // 只能选中三级分类下有效
      this.getData()
    },

    // Tabs标签页点击切换
    handleClick() {
      // 只能选中三级分类下有效
      this.getData()
      /*
      为什么前后打印的数据不一样，异步函数不是已经相当于同步函数？？？
      console.log(this.attrData)
      setTimeout(() => {
        console.log(this.attrData)
      }, 1000)
    */
    },

    // 抽离：发送请求。获取对应cateId、对应参数或属性的数据
    async getData() {
      // 抽离：判断当前选中的分类等级，只能选中三级分类
      if (this.selectCate.length !== 3) {
        this.selectCate = []
        // 直接结束不进行请求
        this.paramsData = []
        this.attrData = []
        this.$message.info('只允许为三级商品分类设置参数')
        return
      }

      /*
      发送获取数据的请求
          参数：
              分类id--属性计算从选择的数组中获取
              动态、静态：从双向绑定的当前tabs页获取
    */
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      /*
      获取参数列表后，对每一项参数进行按需处理
          1.attr_vals进行处理，改为数组，以渲染展开行
          2.为每一项参数添加标志位，控制该行参数展开行的tag和input切换
          3.解决空字符串切割后数组长度为1问题，使用三元表达式优化，如果为空，返回空数组
      */
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      //  判断是参数还是属性发起的请求，将响应的参数赋值给相应的数据模型
      if (this.activeName === 'many') this.paramsData = res.data
      if (this.activeName === 'only') this.attrData = res.data
    },
    addDialogOpen() {
      this.addDialogVisible = true
    },

    // 关闭添加参数属性对话框
    addDialogClose() {
      this.$refs.addAttrFormRef.resetFields()
    },
    // 点击提交添加属性,预验证
    addAttr() {
      this.$refs.addAttrFormRef.validate(async valid => {
        if (!valid) return this.message.error('信息填写错误')
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addAttrForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getData()
        this.addDialogVisible = false
      })
    },

    // 打开修改对话框
    async aditAttrDialogOpen(attrs) {
      this.aditAttrForm.attr_id = attrs.attr_id
      // 获取当前参数id，显示参数名：1.从作用域插槽。2根据Id查询后台参数【保证数据最新】
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrs.attr_id}`)
      if (res.meta.status !== 200) return this.$message.error('获取当前参数失败')
      this.aditAttrForm.attr_name = res.data.attr_name
      this.editdialogVisible = true
    },
    // 关闭修改参数对话框
    editDialogClose() {
      this.$refs.aditAttrFormRef.resetFields()
    },
    // 提交修改参数
    editAttr() {
      this.$refs.aditAttrFormRef.validate(async valid => {
        if (!valid) return this.$message.error('信息填写错误')
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.aditAttrForm.attr_id}`, {
          attr_name: this.aditAttrForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getData()
        this.editdialogVisible = false
      })
    },

    // 点击按钮删除参数
    async deleteAttr(attrs) {
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrs.attr_id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getData()
    },

    // input输入框：鼠标离开、anter弹起触发，标志为设置为false,显示button
    handleInputConfirm(row) {
      // 隐藏input
      row.inputVisible = false
      // input不合法，则清空
      console.log(row.inputValue)
      if (row.inputValue.trim() === '') return this.$message.error('输入内容不能为空，不能以空格开头')
      /*
      input输入合法：
            1.添加到row.inputValue(作用域插槽数据双向绑定)
            2.清空输入框
            3.请求服务器保存数据
       */
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      this.updata(row)
    },

    // 点击New tag，标志位设置为true，显示input输入框
    showInput(row) {
      // 显示input
      row.inputVisible = true
      // 让input自动获得焦点,$nextTick()页面重新渲染完成后自动调用该函数，执行回调函数
      this.$nextTick(() => {
        // 获取input的原生Dom对象
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    /*
     点击tag标签删除：
              1.前端：删除响应的的数据数据模型
              2.后台：请求更新后台数据
      */
    tagDelete(row, index) {
      row.attr_vals.splice(index, 1)
      this.updata(row)
    },

    // 更新后台数据（添加、删除 调用）
    async updata(row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    }
  }
}

</script>

<style lang="less" scope>
.select {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.input-new-tag {
  width: 20% !important;
}
</style>
