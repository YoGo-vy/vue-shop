<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 2.为Echarts 视图组件准备具备宽高的盒子 -->
           <div class="report" style="width:100%;height:300px;"></div>
        </el-card>
    </div>
</template>
<script>
// 1.导入Echarts视图组件
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      //  需要合并的选项
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  //  Vue组件初始化，data和methods可以使用
  created() {
  },

  //  Vue数据已经渲染到页面中
  async mounted() {
    //  3.初始化echarts实例对象
    const myecharts = echarts.init(document.querySelector('.report'))

    // 4.准备图表的配置和数据
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    this.reportData = res.data
    const result = _.merge(res.data, this.options)
    console.table(result)

    //  5.使用配置和数据渲染图表
    myecharts.setOption(result)
  },
  methods: {
  }

}
</script>

<style lang="less">

</style>
