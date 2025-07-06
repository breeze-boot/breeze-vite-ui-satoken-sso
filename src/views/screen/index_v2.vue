<!--
 * @author: gaoweixuan
 * @since: 2025-06-24
 * @description: 科技风格数据大屏
-->
<template>
  <div ref="fullscreenDiv" class="fullscreen-div">
    <div class="dashboard-header">
      <div class="header-title">
        <h1>数据监控大屏</h1>
        <div class="header-subtitle">实时数据分析平台</div>
      </div>
      <div class="time-info">
        <span>{{ currentDate }}</span>
        <span>{{ currentTime }}</span>
      </div>
    </div>

    <div class="toolbar">
      <div class="toolbar-left">
        <el-select v-model="state.timeRange" placeholder="选择时间范围">
          <el-option label="今日" value="today"></el-option>
          <el-option label="昨日" value="yesterday"></el-option>
          <el-option label="本周" value="week"></el-option>
          <el-option label="本月" value="month"></el-option>
        </el-select>
        <el-button-group>
          <el-button type="primary" icon="Refresh">刷新</el-button>
          <el-button type="primary" icon="Download">导出</el-button>
        </el-button-group>
      </div>
      <div class="toolbar-right">
        <el-switch v-model="state.autoRefresh" active-text="自动刷新" inactive-text="手动刷新" />
        <el-button class="fullscreen-btn" :class="{ active: isFullscreen }" @click="toggleFullscreen">
          <i class="el-icon-full-screen"></i>
          <span>{{ isFullscreen ? '退出全屏' : '全屏显示' }}</span>
        </el-button>
      </div>
    </div>

    <div class="grid-container">
      <!-- 左侧面板 -->
      <div class="grid-item panel-left">
        <div class="card card-animate">
          <div class="card-header">
            <h3>实时访问统计</h3>
            <span class="update-time">更新于: {{ state.lastUpdateTime }}</span>
          </div>
          <div class="card-body">
            <div class="stat-group">
              <div class="stat-item">
                <div class="stat-icon"><i class="el-icon-user"></i></div>
                <div class="stat-content">
                  <div class="stat-value">{{ state.visitorCount }}</div>
                  <div class="stat-label">总访问量</div>
                  <div class="stat-change positive">
                    <i class="el-icon-arrow-up"></i>
                    12.5%
                  </div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon"><i class="el-icon-connection"></i></div>
                <div class="stat-content">
                  <div class="stat-value">{{ state.onlineUsers }}</div>
                  <div class="stat-label">在线用户</div>
                  <div class="stat-change negative">
                    <i class="el-icon-arrow-down"></i>
                    3.2%
                  </div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon"><i class="el-icon-document"></i></div>
                <div class="stat-content">
                  <div class="stat-value">{{ state.pageViews }}</div>
                  <div class="stat-label">页面浏览量</div>
                  <div class="stat-change positive">
                    <i class="el-icon-arrow-up"></i>
                    8.7%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card card-animate" style="animation-delay: 0.1s">
          <div class="card-header">
            <h3>访问来源分布</h3>
          </div>
          <div class="card-body">
            <div class="chart-container" ref="sourceChart"></div>
          </div>
        </div>
      </div>

      <!-- 中间面板 -->
      <div class="grid-item panel-center">
        <div class="card card-animate" style="animation-delay: 0.2s">
          <div class="card-header">
            <h3>业务指标趋势</h3>
            <div class="chart-actions">
              <el-radio-group v-model="state.chartType">
                <el-radio-button label="line">折线图</el-radio-button>
                <el-radio-button label="bar">柱状图</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-container" ref="trendChart"></div>
          </div>
        </div>

        <div class="card card-animate" style="animation-delay: 0.3s">
          <div class="card-header">
            <h3>实时告警</h3>
            <div class="alert-count">
              <el-badge :value="alertCount" type="danger"></el-badge>
            </div>
          </div>
          <div class="card-body">
            <el-scrollbar wrap-class="scrollbar-wrapper">
              <el-table :data="state.alerts" stripe style="width: 100%">
                <el-table-column prop="time" label="时间"></el-table-column>
                <el-table-column prop="level" label="级别">
                  <template #default="scope">
                    <el-tag :type="getTagType(scope.row.level)">{{ scope.row.level }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="message" label="告警信息"></el-table-column>
                <el-table-column label="操作">
                  <template #default="scope">
                    <el-button size="small" type="text" @click="handleAlert(scope.row)">处理</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-scrollbar>
          </div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="grid-item panel-right">
        <div class="card card-animate" style="animation-delay: 0.4s">
          <div class="card-header">
            <h3>系统性能监控</h3>
          </div>
          <div class="card-body">
            <div class="performance-item">
              <div class="performance-header">
                <div class="performance-label">CPU 使用率</div>
                <div class="performance-value">{{ state.cpuUsage }}%</div>
              </div>
              <el-progress :percentage="state.cpuUsage" :color="cpuColor" :stroke-width="18" />
              <div class="performance-detail">
                <span>峰值: 85%</span>
                <span>平均: 52%</span>
              </div>
            </div>
            <div class="performance-item">
              <div class="performance-header">
                <div class="performance-label">内存使用率</div>
                <div class="performance-value">{{ state.memoryUsage }}%</div>
              </div>
              <el-progress :percentage="state.memoryUsage" :color="memoryColor" :stroke-width="18" />
              <div class="performance-detail">
                <span>峰值: 92%</span>
                <span>平均: 68%</span>
              </div>
            </div>
            <div class="performance-item">
              <div class="performance-header">
                <div class="performance-label">磁盘使用率</div>
                <div class="performance-value">{{ state.diskUsage }}%</div>
              </div>
              <el-progress :percentage="state.diskUsage" :color="diskColor" :stroke-width="18" />
              <div class="performance-detail">
                <span>峰值: 78%</span>
                <span>平均: 45%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card card-animate" style="animation-delay: 0.5s">
          <div class="card-header">
            <h3>地域分布</h3>
          </div>
          <div class="card-body">
            <div class="chart-container" ref="regionChart"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-left">
        <span>系统状态:</span>
        <el-tag type="success">正常运行中</el-tag>
        <span class="ml-2">更新频率: 3秒</span>
      </div>
      <div class="footer-right">
        <span>版本: v2.5.0</span>
        <span class="ml-4">数据截至: {{ currentTime }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed, nextTick, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

// 全屏控制
let fullscreenDiv = ref()
const isFullscreen = ref(false)

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    if (fullscreenDiv.value && fullscreenDiv.value.requestFullscreen) {
      fullscreenDiv.value.requestFullscreen().catch((err: any) => {
        alert(`无法进入全屏模式: ${err.message}`)
      })
      isFullscreen.value = true
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch((err) => {
        alert(`无法退出全屏模式: ${err.message}`)
      })
      isFullscreen.value = false
    }
  }
}

// 监听全屏状态变化
document.addEventListener('fullscreenchange', () => {
  isFullscreen.value = !!document.fullscreenElement
})

// 数据状态
const state = reactive({
  visitorCount: 125432,
  onlineUsers: 2456,
  pageViews: 345678,
  cpuUsage: 45,
  memoryUsage: 65,
  diskUsage: 30,
  alerts: [
    { time: '09:12:34', level: '警告', message: '服务器CPU使用率过高' },
    { time: '08:45:12', level: '提示', message: '新用户注册量激增' },
    { time: '07:32:45', level: '错误', message: '数据库连接超时' },
    { time: '06:15:23', level: '提示', message: '系统更新完成' },
    { time: '05:42:17', level: '警告', message: '内存使用率超过阈值' },
    { time: '04:28:56', level: '提示', message: '数据备份成功' },
    { time: '03:12:49', level: '错误', message: 'API请求超时' },
    { time: '02:56:31', level: '提示', message: '系统负载正常' },
    { time: '01:43:27', level: '警告', message: '磁盘空间不足' },
    { time: '00:21:58', level: '提示', message: '定时任务执行完成' },
  ],
  lastUpdateTime: '',
  timeRange: 'today',
  autoRefresh: true,
  chartType: 'line',
})

// 当前时间
const currentDate = ref('')
const currentTime = ref('')

const updateDateTime = () => {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  state.lastUpdateTime = currentTime.value
}

// 告警数量
const alertCount = computed(() => {
  return state.alerts.filter((alert) => alert.level === '错误' || alert.level === '警告').length
})

// 告警标签类型
const getTagType = (level: string) => {
  switch (level) {
    case '错误':
      return 'danger'
    case '警告':
      return 'warning'
    case '提示':
      return 'info'
    default:
      return 'info'
  }
}

// 性能指标颜色
const cpuColor = computed(() => {
  return state.cpuUsage > 80 ? '#f56c6c' : state.cpuUsage > 60 ? '#e6a23c' : '#67c23a'
})

const memoryColor = computed(() => {
  return state.memoryUsage > 80 ? '#f56c6c' : state.memoryUsage > 60 ? '#e6a23c' : '#67c23a'
})

const diskColor = computed(() => {
  return state.diskUsage > 80
    ? '#f56c6c'
    : state.diskUsage > 60
      ? '#e6a23c'
      : state.diskUsage > 90
        ? '#909399'
        : '#67c23a'
})

// 图表引用
const sourceChart = ref()
const trendChart = ref()
const regionChart = ref()
const chartInstances = ref<any>({})

// 监听窗口大小变化
const handleResize = () => {
  Object.values(chartInstances.value).forEach((chart: any) => {
    if (chart && chart.resize) {
      chart.resize()
    }
  })
}

// 初始化图表
const initCharts = async () => {
  await nextTick()

  try {
    // 访问来源分布图表
    const sourceChartInstance = echarts.init(sourceChart.value)
    sourceChartInstance.setOption({
      color: ['#32c5e9', '#67e0e3', '#91f2de', '#ffdb5c', '#ff9f7f'],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '16',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 335, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 234, name: '联盟广告' },
            { value: 135, name: '视频广告' },
            { value: 1548, name: '搜索引擎' },
          ],
        },
      ],
    })
    chartInstances.value.sourceChart = sourceChartInstance

    // 业务指标趋势图表
    const trendChartInstance = echarts.init(trendChart.value)
    trendChartInstance.setOption({
      color: ['#32c5e9', '#67e0e3'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      legend: {
        data: ['访问量', '转化率'],
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '访问量',
          type: state.chartType,
          data: [120, 132, 101, 134, 90, 230, 210, 235, 250, 210, 190, 220],
        },
        {
          name: '转化率',
          type: state.chartType,
          data: [22, 33, 20, 34, 19, 43, 41, 45, 48, 42, 38, 44],
        },
      ],
    })
    chartInstances.value.trendChart = trendChartInstance

    // 地域分布图表
    const regionChartInstance = echarts.init(regionChart.value)
    regionChartInstance.setOption({
      color: ['#32c5e9', '#67e0e3', '#91f2de', '#ffdb5c', '#ff9f7f'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: 'category',
        data: ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京', '重庆', '西安'],
      },
      series: [
        {
          name: '访问量',
          type: 'bar',
          data: [320, 302, 301, 334, 390, 330, 320, 280, 250, 220],
        },
      ],
    })
    chartInstances.value.regionChart = regionChartInstance

    console.log('图表初始化成功')
  } catch (error) {
    console.error('图表初始化失败:', error)
  }
}

// 监听图表类型变化
watch(
  () => state.chartType,
  (newType) => {
    if (chartInstances.value.trendChart) {
      chartInstances.value.trendChart.setOption({
        series: [{ type: newType }, { type: newType }],
      })
    }
  },
)

// 模拟数据更新
const simulateDataUpdate = () => {
  const updateInterval = setInterval(() => {
    if (!state.autoRefresh) return

    // 更新CPU使用率
    state.cpuUsage = Math.max(20, Math.min(90, state.cpuUsage + Math.floor(Math.random() * 11) - 5))

    // 更新内存使用率
    state.memoryUsage = Math.max(30, Math.min(95, state.memoryUsage + Math.floor(Math.random() * 9) - 4))

    // 更新磁盘使用率
    state.diskUsage = Math.max(10, Math.min(85, state.diskUsage + Math.floor(Math.random() * 5) - 2))

    // 更新访问量
    state.visitorCount += Math.floor(Math.random() * 100)
    state.onlineUsers = Math.max(1000, Math.min(5000, state.onlineUsers + Math.floor(Math.random() * 101) - 50))
    state.pageViews += Math.floor(Math.random() * 500)

    // 更新最后更新时间
    updateDateTime()

    // 随机添加新告警
    if (Math.random() > 0.7) {
      const levels = ['错误', '警告', '提示']
      const messages = [
        '服务器CPU使用率过高',
        '新用户注册量激增',
        '数据库连接超时',
        '系统更新完成',
        '内存使用率超过阈值',
        '数据备份成功',
        'API请求超时',
        '系统负载正常',
        '磁盘空间不足',
        '定时任务执行完成',
      ]

      const newAlert = {
        time: currentTime.value,
        level: levels[Math.floor(Math.random() * levels.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
      }

      state.alerts.unshift(newAlert)
      // 保持最多10条告警
      if (state.alerts.length > 10) {
        state.alerts.pop()
      }
    }
  }, 3000)

  return () => clearInterval(updateInterval)
}

// 处理告警
const handleAlert = (alert: any) => {
  // 这里可以实现告警处理逻辑
  alert.handled = true
  console.log('处理告警:', alert)
}

onMounted(() => {
  updateDateTime()
  setInterval(updateDateTime, 1000)

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)

  // 初始化图表
  initCharts()

  // 模拟数据更新
  const cleanup = simulateDataUpdate()

  // 组件卸载时清理
  onUnmounted(() => {
    cleanup()
    window.removeEventListener('resize', handleResize)
    Object.values(chartInstances.value).forEach((chart: any) => {
      if (chart && chart.dispose) {
        chart.dispose()
      }
    })
  })
})
</script>

<style lang="scss" scoped>
/* 重置全局样式 */
html,
body,
#app {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

/* 全局动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes gradientMove {
  0% {
    background-position: 0 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0 50%;
  }
}

.fullscreen-div {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: 20px;
  color: #fff;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);

  .dashboard-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 15px;

    .header-title {
      h1 {
        margin: 0;
        font-size: 28px;
        font-weight: bold;
        color: #32c5e9;
      }

      .header-subtitle {
        margin-top: 5px;
        font-size: 14px;
        color: #94a3b8;
      }
    }

    .time-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      span {
        font-size: 16px;
        color: #94a3b8;
      }

      span:first-child {
        margin-bottom: 5px;
      }
    }
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    margin-bottom: 15px;

    .toolbar-left {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .toolbar-right {
      display: flex;
      gap: 15px;
      align-items: center;

      .fullscreen-btn {
        display: flex;
        gap: 5px;
        align-items: center;
        padding: 8px 15px;
        color: #3b82f6;
        background: rgb(59 130 246 / 20%);
        border: 1px solid rgb(59 130 246 / 50%);
        border-radius: 6px;
        transition: all 0.3s;

        &:hover {
          background: rgb(59 130 246 / 30%);
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 20%);
          transform: translateY(-2px);
        }

        &.active {
          color: #ef4444;
          background: rgb(239 68 68 / 20%);
          border-color: rgb(239 68 68 / 50%);
        }

        i {
          font-size: 18px;
        }
      }
    }
  }

  .grid-container {
    display: grid;
    flex: 1;
    grid-template-columns: 30% 40% 30%;
    gap: 20px;

    .grid-item {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .card {
      overflow: hidden;
      background: rgb(30 41 59 / 70%);
      backdrop-filter: blur(10px);
      border: 1px solid rgb(59 130 246 / 20%);
      border-radius: 8px;
      opacity: 0;
      transition: all 0.3s;

      &:hover {
        border-color: rgb(59 130 246 / 50%);
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 30%);
        transform: translateY(-5px);
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 20px;
        border-bottom: 1px solid rgb(59 130 246 / 20%);

        h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 500;
          color: #cbd5e1;
        }

        .update-time {
          font-size: 12px;
          color: #94a3b8;
        }

        .chart-actions {
          .el-radio-button__inner {
            color: #cbd5e1;
            background: transparent;
            border-color: rgb(59 130 246 / 50%);

            &:hover {
              color: #3b82f6;
            }

            &.is-active {
              color: #3b82f6;
              background: rgb(59 130 246 / 20%);
              border-color: rgb(59 130 246 / 50%);
            }
          }
        }

        .alert-count {
          .el-badge__content {
            background-color: #ef4444;
            box-shadow:
              0 0 0 2px rgb(30 41 59 / 70%),
              0 0 0 4px #ef4444;
          }
        }
      }

      .card-body {
        flex: 1;
        padding: 20px;

        .stat-group {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          padding: 15px;
          background: rgb(15 23 42 / 30%);
          border-radius: 8px;
          transition: all 0.3s;

          &:hover {
            box-shadow: 0 5px 10px -2px rgb(0 0 0 / 20%);
            transform: translateY(-3px);
          }

          .stat-icon {
            margin-bottom: 10px;
            font-size: 24px;
            color: #3b82f6;
          }

          .stat-content {
            .stat-value {
              margin-bottom: 5px;
              font-size: 24px;
              font-weight: bold;
              color: #32c5e9;
            }

            .stat-label {
              margin-bottom: 5px;
              font-size: 14px;
              color: #94a3b8;
            }

            .stat-change {
              font-size: 12px;

              &.positive {
                color: #67c23a;
              }

              &.negative {
                color: #f56c6c;
              }
            }
          }
        }

        .performance-item {
          margin-bottom: 20px;

          .performance-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;

            .performance-label {
              font-size: 14px;
              color: #94a3b8;
            }

            .performance-value {
              font-size: 16px;
              font-weight: 500;
            }
          }

          .performance-detail {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            font-size: 12px;
            color: #94a3b8;
          }
        }

        .chart-container {
          width: 100%;
          height: 100%;
          min-height: 200px;
        }
      }
    }

    .card-animate {
      animation: fadeIn 0.5s ease forwards;
    }

    .panel-left,
    .panel-right {
      .card {
        flex: 1;
      }
    }

    .panel-center {
      .card:first-child {
        flex: 3;
      }

      .card:last-child {
        flex: 2;
      }
    }
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    margin-top: 15px;
    font-size: 14px;
    color: #94a3b8;
    border-top: 1px solid rgb(59 130 246 / 10%);

    .ml-2 {
      margin-left: 10px;
    }

    .ml-4 {
      margin-left: 20px;
    }
  }
}

/* 为卡片添加动画延迟 */
.card-animate:nth-child(1) {
  animation-delay: 0.1s;
}

.card-animate:nth-child(2) {
  animation-delay: 0.2s;
}

.card-animate:nth-child(3) {
  animation-delay: 0.3s;
}

.card-animate:nth-child(4) {
  animation-delay: 0.4s;
}

.card-animate:nth-child(5) {
  animation-delay: 0.5s;
}

.card-animate:nth-child(6) {
  animation-delay: 0.6s;
}
</style>
