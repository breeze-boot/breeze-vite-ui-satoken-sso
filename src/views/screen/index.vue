<!--
 * @author: gaoweixuan
 * @since: 2025-06-24
 * @description: 简约风格数据大屏
-->
<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { FullScreen, Refresh, Menu } from '@element-plus/icons-vue'
import { ElMessageBox, ElNotification } from 'element-plus'
import * as echarts from 'echarts'

// 全屏控制
let fullscreenDiv = ref()
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    if (fullscreenDiv.value && fullscreenDiv.value.requestFullscreen) {
      fullscreenDiv.value.requestFullscreen().catch((err: any) => {
        ElMessageBox.alert(`无法进入全屏模式: ${err.message}`, '提示')
      })
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch((err) => {
        ElMessageBox.alert(`无法退出全屏模式: ${err.message}`, '提示')
      })
    }
  }
}

// 模拟数据
const dashboardData = reactive({
  // 关键指标卡片数据
  keyMetrics: [
    {
      id: 1,
      title: '总用户数',
      value: '128,456',
      trend: 12.5,
      trendClass: 'up',
      icon: 'User',
    },
    {
      id: 2,
      title: '今日活跃',
      value: '8,742',
      trend: 5.2,
      trendClass: 'up',
      icon: 'Active',
    },
    {
      id: 3,
      title: '转化率',
      value: '24.8%',
      trend: -2.1,
      trendClass: 'down',
      icon: 'Conversion',
    },
    {
      id: 4,
      title: '销售额',
      value: '¥1,258,963',
      trend: 8.3,
      trendClass: 'up',
      icon: 'Sales',
    },
  ],

  // 图表数据
  charts: {
    // 趋势图数据
    trendData: {
      xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        { name: '用户增长', data: [120, 190, 170, 230, 250, 300] },
        { name: '销售额', data: [80, 120, 150, 190, 220, 280] },
      ],
    },

    // 饼图数据
    pieData: {
      categories: ['产品A', '产品B', '产品C', '产品D'],
      values: [35, 25, 20, 20],
    },

    // 柱状图数据
    barData: {
      xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      series: { name: '日活跃用户', data: [500, 650, 700, 600, 800, 1000, 900] },
    },
  },

  // 最近数据更新时间
  lastUpdate: new Date().toLocaleString(),
})

// 图表实例引用
const trendChartRef = ref()
const pieChartRef = ref()
const barChartRef = ref()

// 初始化趋势图表
const initTrendChart = () => {
  const chartDom = trendChartRef.value
  const myChart = echarts.init(chartDom)
  const option = {
    grid: { top: '10%', bottom: '15%', left: '5%', right: '5%' },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: dashboardData.charts.trendData.xAxis,
      axisLabel: { rotate: 45 },
    },
    yAxis: {
      type: 'value',
    },
    series: dashboardData.charts.trendData.series.map((item) => ({
      ...item,
      type: 'line',
      smooth: true,
      symbolSize: 6,
      lineStyle: {
        width: 2,
      },
    })),
  }
  myChart.setOption(option)
  window.addEventListener('resize', () => myChart.resize())
}

// 初始化饼图
const initPieChart = () => {
  const chartDom = pieChartRef.value
  const myChart = echarts.init(chartDom)
  const option = {
    grid: { top: '10%', bottom: '15%' },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    series: [
      {
        name: '产品分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: '{b}: {d}%',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: true,
        },
        data: dashboardData.charts.pieData.categories.map((category, index) => ({
          name: category,
          value: dashboardData.charts.pieData.values[index],
        })),
      },
    ],
  }
  myChart.setOption(option)
  window.addEventListener('resize', () => myChart.resize())
}

// 初始化柱状图
const initBarChart = () => {
  const chartDom = barChartRef.value
  const myChart = echarts.init(chartDom)
  const option = {
    grid: { top: '10%', bottom: '15%', left: '5%', right: '5%' },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: dashboardData.charts.barData.xAxis,
      axisLabel: { rotate: 45 },
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        ...dashboardData.charts.barData.series,
        type: 'bar',
        barWidth: '30%',
        itemStyle: {
          borderRadius: 6,
        },
      },
    ],
  }
  myChart.setOption(option)
  window.addEventListener('resize', () => myChart.resize())
}

// 模拟数据更新
const refreshData = () => {
  // 更新关键指标数据
  dashboardData.keyMetrics.forEach((metric) => {
    if (metric.id === 1) {
      metric.value = (Math.floor(Math.random() * 5000) + 125000).toLocaleString()
    } else if (metric.id === 2) {
      metric.value = (Math.floor(Math.random() * 2000) + 7000).toString()
    } else if (metric.id === 3) {
      metric.value = (Math.random() * 30 + 20).toFixed(1) + '%'
    } else if (metric.id === 4) {
      metric.value = '¥' + (Math.floor(Math.random() * 100000) + 1200000).toLocaleString()
    }

    // 更新趋势
    metric.trend = Number((Math.random() * 10 - 5).toFixed(1))
    metric.trendClass = parseFloat(metric.trend) >= 0 ? 'up' : 'down'
  })

  // 更新图表数据
  dashboardData.charts.trendData.series[0].data = dashboardData.charts.trendData.series[0].data.map(
    () => Math.floor(Math.random() * 100) + 100,
  )
  dashboardData.charts.trendData.series[1].data = dashboardData.charts.trendData.series[1].data.map(
    () => Math.floor(Math.random() * 100) + 80,
  )

  dashboardData.charts.barData.series.data = dashboardData.charts.barData.series.data.map(
    () => Math.floor(Math.random() * 500) + 500,
  )

  // 更新时间
  dashboardData.lastUpdate = new Date().toLocaleString()

  // 重新渲染图表
  initTrendChart()
  initBarChart()

  ElNotification({
    title: '数据更新',
    message: '数据已成功刷新',
    type: 'success',
    duration: 3000,
  })
}

// 组件挂载后初始化
onMounted(() => {
  initTrendChart()
  initPieChart()
  initBarChart()

  // 定时刷新数据
  setInterval(refreshData, 10000)
})
</script>

<template>
  <div ref="fullscreenDiv" class="dashboard-container">
    <!-- 顶部标题栏 -->
    <header class="header">
      <div class="title">
        <h1>数据可视化大屏</h1>
        <p>实时业务数据监控</p>
      </div>
      <div class="tools">
        <el-button circle :icon="Refresh" @click="refreshData" class="tool-button" type="primary" plain />
        <el-button circle :icon="FullScreen" @click="toggleFullscreen" class="tool-button" type="primary" plain />
        <el-button circle :icon="Menu" class="tool-button" type="primary" plain />
        <span class="update-time">最后更新: {{ dashboardData.lastUpdate }}</span>
      </div>
    </header>

    <!-- 主要内容区 -->
    <main class="main-content">
      <!-- 关键指标卡片 -->
      <section class="key-metrics">
        <div v-for="metric in dashboardData.keyMetrics" :key="metric.id" class="metric-card">
          <div class="metric-header">
            <span class="metric-title">{{ metric.title }}</span>
            <i class="metric-icon">{{ metric.icon }}</i>
          </div>
          <div class="metric-value">{{ metric.value }}</div>
          <div class="metric-trend">
            <span :class="['trend-sign', metric.trendClass]">
              {{ metric.trend >= 0 ? '+' : '' }}{{ metric.trend }}%
            </span>
            <span class="trend-text">较上周</span>
          </div>
        </div>
      </section>

      <!-- 图表区域 -->
      <section class="charts-container">
        <div class="chart-row">
          <div class="chart-col">
            <div class="chart-title">用户增长趋势</div>
            <div ref="trendChartRef" class="chart"></div>
          </div>
          <div class="chart-col">
            <div class="chart-title">产品分布</div>
            <div ref="pieChartRef" class="chart"></div>
          </div>
        </div>
        <div class="chart-row">
          <div class="chart-col full-width">
            <div class="chart-title">周活跃用户</div>
            <div ref="barChartRef" class="chart"></div>
          </div>
        </div>
      </section>
    </main>

    <!-- 底部信息 -->
    <footer class="footer">
      <p>© 2025 数据可视化系统. 保留所有权利.</p>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
/* 基础样式 */
:root {
  --primary-color: #1890ff;
  --secondary-color: #409eff;
  --background-color: #f5f7fa;
  --card-background: #fff;
  --text-color: #333;
  --light-text: #666;
  --border-color: #ebeef5;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --danger-color: #f5222d;
}

body {
  padding: 0;
  margin: 0;
  overflow-x: hidden;
  font-family: 'PingFang SC', 'Helvetica Neue', Helvetica, 'Microsoft YaHei', Arial, sans-serif;
  background-color: var(--background-color);
}

.dashboard-container {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  padding: 20px;
}

/* 头部样式 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  margin-bottom: 20px;
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 8%);
}

.title {
  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--text-color);
  }

  p {
    margin: 5px 0 0;
    font-size: 14px;
    color: var(--light-text);
  }
}

.tools {
  display: flex;
  gap: 10px;
  align-items: center;

  .tool-button {
    width: 36px;
    height: 36px;
    padding: 0;
    margin: 0;
    color: white;
    background-color: var(--primary-color);

    &:hover {
      background-color: var(--secondary-color);
    }
  }

  .update-time {
    margin-left: 10px;
    font-size: 14px;
    color: var(--light-text);
  }
}

/* 主要内容样式 */
.main-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 20px;
}

/* 关键指标卡片 */
.key-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 20px;

  .metric-card {
    padding: 20px;
    background-color: var(--card-background);
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 8%);
    transition:
      transform 0.3s,
      box-shadow 0.3s;

    &:hover {
      box-shadow: 0 10px 20px 0 rgb(0 0 0 / 12%);
      transform: translateY(-5px);
    }

    .metric-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;

      .metric-title {
        font-size: 16px;
        font-weight: 500;
        color: var(--text-color);
      }

      .metric-icon {
        font-size: 24px;
        color: var(--primary-color);
      }
    }

    .metric-value {
      margin-bottom: 10px;
      font-size: 28px;
      font-weight: 700;
      color: var(--text-color);
    }

    .metric-trend {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: var(--light-text);

      .trend-sign {
        display: inline-flex;
        align-items: center;
        margin-right: 5px;
        font-weight: 500;

        &.up {
          color: var(--success-color);
        }

        &.down {
          color: var(--danger-color);
        }
      }
    }
  }
}

/* 图表容器 */
.charts-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 20px;

  .chart-row {
    display: flex;
    flex: 1;
    gap: 20px;

    .chart-col {
      display: flex;
      flex: 1;
      flex-direction: column;
      padding: 20px;
      background-color: var(--card-background);
      border-radius: 8px;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 8%);

      &.full-width {
        flex: 100%;
      }

      .chart-title {
        margin-bottom: 15px;
        font-size: 18px;
        font-weight: 600;
        color: var(--text-color);
      }

      .chart {
        flex: 1;
        min-height: 300px;
      }
    }
  }
}

/* 底部样式 */
.footer {
  padding: 10px;
  margin-top: 20px;
  font-size: 14px;
  color: var(--light-text);
  text-align: center;
}

/* 响应式布局 */
@media (width <= 1200px) {
  .key-metrics {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-container .chart-row {
    flex-direction: column;
  }
}

@media (width <= 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .title {
    margin-bottom: 15px;
  }

  .key-metrics {
    grid-template-columns: 1fr;
  }
}
</style>
