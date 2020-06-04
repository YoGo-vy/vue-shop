<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-alert
                title="添加商品信息"
                type="info"
                center
                show-icon
                class="alert_info">
            </el-alert>

            <!-- Steps进度条 -->
            <el-steps :space="200" align-center
            :active="activeName-0" finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <!-- form表单区域，包裹所有的tabs标签页 -->
            <el-form :model="addGoodsForm"
            :rules="addGoodsRules"
            ref="addGoodsFormRef"
            label-position="top">

                <!-- Tabs标签分页显示 -->
                <el-tabs v-model="activeName" tabPosition="left"
                :before-leave="tabs_beforeleave"
                @tab-click="tabsClick()">

                     <!-- 基本信息页 -->
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addGoodsForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input type="number" v-model.number="addGoodsForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input type="number" v-model.number="addGoodsForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input type="number" v-model.number="addGoodsForm.goods_number"></el-input>
                        </el-form-item>

                        <!-- Cascader级联选择器 -->
                        <el-form-item label="商品分类">
                            <el-cascader
                                v-model="addGoodsForm.goods_cat"
                                :options="cateList"
                                :props="cateProps"
                                @change="selectChange()" class="cascader_select">
                            </el-cascader>
                        </el-form-item>

                    </el-tab-pane>
                    <!-- 商品动态参数页 -->
                    <el-tab-pane label="商品参数" name="1">
                        <!-- 渲染当前类下的参数类别 -->
                        <el-form-item :label="item.attr_name" v-for="item in paramsData" :key="item.attr_id">
                             <!-- checkbox多选框组,渲染该类下的所有参数；；v-model绑定提交值数组 -->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border :label="item2" v-for="(item2, index) in item.attr_vals" :key="index">{{item2}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>

                    <!-- 商品静态属性 -->
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in attrData" :key="item.attr_id">
                           <el-checkbox-group v-model="item.attr_vals">
                               <el-checkbox border :label="item2" v-for="(item2,index) in item.attr_vals" :key="index"></el-checkbox>
                           </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>

                    <!-- Upload组件 图片上传
                                     action：不应为当前访问地址地址
                                     header：设置token（Authorization）
                                     on-success:监听图片上传成功
                                     on-preview：点击预览
                                     on-remove：移除图片-->
                    <el-tab-pane label="商品图片" name="3">
                      <el-upload
                        class="upload-demo"
                        action="http://127.0.0.1:8888/api/private/v1/upload"
                        :headers="headerObj"
                        :on-success="uploadSuccess"
                        :on-preview="preview"
                        :on-remove="handleremove"
                        list-type="picture">
                          <el-button size="small" type="primary">点击上传</el-button>
                          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                      </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">

                      <!-- 商品内容：富文本编辑器 -->
                      <quill-editor
                      ref="myQuillEditor"
                      v-model="addGoodsForm.goods_introduce"
                      />

                      <el-button type="primary" class="btn_addGoods" @click="addGoods()">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>

            </el-form>
        </el-card>

        <!-- 上传图片预览 Dialog -->
        <el-dialog
          title="图片预览"
          :visible.sync="previewDialogVisible"
          width="60%">
          <img :src="previewSrc" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'
export default {

  data() {
    return {
      // 控制tabs标签页和steps进度条联动控制
      activeName: '0',
      //  添加商品表单绑定数据
      addGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        attrs: [],
        // 上传图片地址对象集合
        pics: [],
        // 商品描述（绑定富文本编辑器）
        goods_introduce: ''
      },
      //  商品表单验证规则
      addGoodsRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ]
      },
      // 所有商品分类数据
      cateList: [],
      // cascader级联选择器配置
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },

      // 动态参数数据
      paramsData: [],
      //  静态属性数据
      attrData: [],
      // 图片上传，请求头数据
      headerObj: {
        Authorization: sessionStorage.getItem('token')
      },
      // 控制图片预览的对话框显示与隐藏
      previewDialogVisible: false,
      // 预览图片src
      previewSrc: ''
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    cateId() {
      const length = this.addGoodsForm.goods_cat.length
      return this.addGoodsForm.goods_cat[length - 1]
    }
  },
  methods: {
    //   获取左右分类信息
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品分类信息错误')
      this.cateList = res.data
    },
    // 联级选择框cascader改变，校验选择
    selectChange() {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
        // return语句中不能使用赋值操作
        this.$message.info('请为商品选择三级分类')
      }
    },

    // Tabs标签页的before-leave钩子函数，返回false阻止tabs切换
    tabs_beforeleave(activeName, oldActiveName) {
      if (this.addGoodsForm.goods_cat.length === 0) {
        this.$message.error('请为商品选择分类')
        return false
      }
    },
    // tabs标签页点击切换
    async tabsClick() {
      if (this.activeName === '1' && this.paramsData.length === 0) {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) return this.$message.error('res.meta.msg')
        // 对先响应数据操作将动态参数的values字符串转换成数组，以进行渲染;res.data为数组形式
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.paramsData = res.data
      }
      if (this.activeName === '2' && this.attrData.length === 0) {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) return this.$message.error('res.meta.msg')
        // 对先响应数据操作将动态参数的values字符串转换成数组，以进行渲染;res.data为数组形式
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.attrData = res.data
      }
    },

    // 监听图片上传成功(成功保存在服务器的临时路径中)
    uploadSuccess(res) {
      /*
        注意：
            1.属性绑定的钩子函数自动传递服务器响应的数据作为参数
            2.当前访问为Vue-cli服务器的Vue项目，访问的后台服务器涉及跨域
            3.设置taken为登录状态
            4.图片保存在服务器临时路径，返回路径地址（用于提交图片）和url地址(用于预览图片)

      console.log(data)

      */
      if (res.meta.status !== 200) return this.$message.error('图片上传失败;' + res.meta.msg)
      const img = { pic: res.data.tmp_path }
      this.addGoodsForm.pics.push(img)
    },
    // 图片预览钩子，点击图片预览时触发
    preview(data) {
      // 属性绑定的该钩子函数：自动传递图片信息和服务器响应的数据作为参数
      this.previewSrc = data.response.data.url
      this.previewDialogVisible = true
    },
    // 移除上传图片
    handleremove(imgInfo) {
      const removeInfo = imgInfo.response.data.tmp_path
      this.remove(removeInfo)
    },
    remove(path) {
      /*
      查找当前图片，删除：filter，findindex
      this.addGoodsForm.pics = this.addGoodsForm.pics.filter((item) => {
        return item.pic !== path
      })
      console.log(this.addGoodsForm.pics)
      */

      const index = this.addGoodsForm.pics.findIndex((item) => {
        return item.pic === path
      })
      this.addGoodsForm.pics.splice(index, 1)
    },

    // 点击提交添加商品--对请求参数进行处理
    addGoods() {
      this.$refs.addGoodsFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('信息添加错误')

        /*
      添加商品业务逻辑
          1.对参数列表和属性列表复选框组的结果进行处理
              checkbox数据绑定form的item，绑定paramsData和sttrData
          2.对attr_id进行处理
       */

        // 处理参数列表
        this.paramsData.forEach(item => {
          const param = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addGoodsForm.attrs.push(param)
        })
        // 处理属性列表
        this.attrData.forEach(item => {
          const attr = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addGoodsForm.attrs.push(attr)
        })
        // 处理分类等级 ---深拷贝：不影响绑定该数据的表单
        const form = _.cloneDeep(this.addGoodsForm)
        form.goods_cat = form.goods_cat.join(',')

        // 发送提交请求
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg
          )
        }
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    }

  }
}
</script>

<style lang="less">
.el-steps {
    margin: 15px 0;
    height: 100%;
}
.el-step__icon {
    width: 18px !important;
    height: 18px !important;
    font-size: 12px !important;
}
.el-step__title {
    font-size: 12px !important;
}
.cascader_select {
    width: 30%;
}
.previewImg {
  width: 100%;
}
.ql-container {
  min-height: 200px !important;
}
.btn_addGoods {
  margin: 20px 20px !important;
}
</style>
