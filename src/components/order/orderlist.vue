<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 订单列表 -->
            <el-table :data="orderList" border stripe>
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column prop="order_number" label="订单编号" width="180px"></el-table-column>
                <el-table-column prop="order_price" label="订单价格"></el-table-column>
                <el-table-column prop="order_pay" label="是否付款">
                    <template slot-scope="props">
                        <div>
                            <el-tag >{{props.row.order_pay ===1? '已付款':'未付款'}}</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货"></el-table-column>
                <el-table-column prop="create_time" label="订单创建时间" width="150px">
                    <template slot-scope="props">
                        <div>
                            {{props.row.create_time | dateFormat}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="props">
                        <div>
                             <el-tooltip :enterable="false" effect="light" content="修改地址" placement="bottom-end">
                                 <el-button :enterable="false" type="primary" size="mini" icon="el-icon-edit" @click="editAddress_Opend(props.row)"></el-button>
                            </el-tooltip>

                            <el-tooltip effect="light" content="查看物流" placement="bottom-end">
                                  <el-button type="danger" size="mini" icon="el-icon-location" @click="checkLogistic(props.row)"></el-button>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-col></el-col>
            </el-table>

            <!-- 分页工具条 -->
             <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 8, 12]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- 修改地址对话框 -->
        <el-dialog
        title="修改地址"
        :visible.sync="editAddress_dialogVisible"
        width="36%"
        @close="editAddress_Close">
        <el-form :model="editAddressForm"
        :rules="editAddressRules"
        ref="editAddressFormRef"
        label-width="100px">
            <el-form-item label="当前收货地址">
                <el-input v-model="address" disabled></el-input>
            </el-form-item>
            <p>修改收货地址</p>
            <el-form-item label="省市区/县" prop="address1">
                <el-cascader
                    v-model="editAddressForm.address1"
                    :options="citiData"
                    :props="selectAddressProps"
                    @change="handleChange">
                </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="address2">
                <el-input v-model="editAddressForm.address2"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editAddress_dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editAddress()">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 查看物流对话框 -->
        <el-dialog
        title="查看物流"
        :visible.sync="checkLogistic_dialogVisible"
        width="30%">

        <!-- timeline时间线组件 -->
        <el-timeline :reverse="true">
            <el-timeline-item
            v-for="(activity, index) in logisticData"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
            </el-timeline-item>
        </el-timeline>
        </el-dialog>
    </div>
</template>
<script>
import citiData from './citydata.js'
export default {
  data() {
    return {
      // 分页-查询添加
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      //   订单列表
      orderList: [],
      //   订单中记录数
      total: 0,

      //   控制修改地址显示与隐藏
      editAddress_dialogVisible: false,
      //   选择地址联级选择框数据
      citiData,
      //   选择地址联级选择框规则
      selectAddressProps: {
        label: 'value',
        value: 'label',
        children: 'children',
        expandTrigger: 'hover'
      },
      //   修改地址Form表单(联级选择框的值为数组)
      editAddressForm: {
        address1: [],
        address2: ''
      },
      //   修改地址表单验证规则
      editAddressRules: {
        address1: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', tregger: 'blur' }
        ]
      },
      //   当前收货地址
      address: '',

      //   控制查看物流对话框显示与隐藏
      checkLogistic_dialogVisible: false,
      //   物流信息
      logisticData: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    //   获取订单列表
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.orderList = res.data.goods
      this.total = res.data.total
    },

    // 点击打开修改地址对话框
    editAddress_Opend(row) {
      this.editAddress_dialogVisible = true
      this.address = row.consignee_addr === '' ? '无' : row.consignee_addr
    },

    // 点击确认，修改地址
    editAddress() {},

    // 查看物流
    async checkLogistic(row) {
      const { data: res } = await this.$http.get('kuaidi/' + '1106975712662')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.logisticData = res.data
      this.checkLogistic_dialogVisible = true
    },

    // 页码大小发生改变
    handleSizeChange(pageSize) {
      this.queryInfo.pagesize = pageSize
      this.getOrderList()
    },

    // 当前页码发生改变
    handleCurrentChange(pageNum) {
      this.queryInfo.pagenum = pageNum
      this.getOrderList()
    },
    // 级联选择框改变
    handleChange() {
      console.log(this.editAddressForm)
    },
    // 修改地址对话框关闭（级联选择框也可以重置）
    editAddress_Close() {
      this.$refs.editAddressFormRef.resetFields()
    }
  }
}
</script>

<style lang="less">
.el-tooltip__popper {
    font-size: 6px !important;
}
</style>
