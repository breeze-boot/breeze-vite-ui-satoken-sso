<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts" name="Home">
import { ref, onMounted, computed } from 'vue'
import { loadGreetings } from '@/utils/times'
import useUserStore from '@/store/modules/user'
import useSettingStore from '@/store/modules/setting.ts'
import { SsoClientUrl } from '@/api/home/type.ts'
import { getHomeSsoClient } from '@/api/home'
import LoginUserBar from '@/views/home/component/LoginUserBar.vue'

const userStore = useUserStore()
const settingStore = useSettingStore()

const ssoClient = ref<SsoClientUrl[]>()
const isLoading = ref(true)

// 计算属性：用户信息是否存在
const hasUserInfo = computed(() => userStore.userInfo && Object.keys(userStore.userInfo).length > 0)
console.log(hasUserInfo.value)

// 计算属性：欢迎消息样式
const welcomeStyle = computed(() => ({
  background: `linear-gradient(135deg, ${settingStore.settings.primaryColor || '#165DFF'} 0%, ${settingStore.settings.secondaryColor || '#4080FF'} 100%)`,
  color: 'white',
}))

const handleLoadSystem = async () => {
  try {
    const response: any = await getHomeSsoClient()
    ssoClient.value = response.data.map((item: SsoClientUrl) => ({
      clientName: item.clientName,
      url: item.url + '&X-Tenant-Id=1',
    }))
  } catch (e) {
    console.error('加载系统快捷方式失败:', e)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  handleLoadSystem()
})
</script>

<template>
  <div class="home-container">
    <!-- 欢迎信息卡片 -->
    <div class="welcome-card mb-6" :style="welcomeStyle">
      <div class="welcome-content">
        <div class="avatar-wrapper">
          <el-avatar class="avatar" :size="140" :src="userStore.userInfo?.avatar || settingStore.settings.logoUrl" />
        </div>
        <div class="welcome-text">
          <h2 class="welcome-title">
            {{ loadGreetings() }},
            <span>{{ userStore.userInfo?.username || '用户' }}</span>
          </h2>
          <p class="welcome-subtitle">每一天，都是您迈向卓越的新起点！</p>
          <div class="welcome-actions">
            <el-button type="primary" size="small" class="action-btn">
              <i class="el-icon-s-claim mr-2"></i>
              个人中心
            </el-button>
            <el-button type="text" size="small" class="action-btn-text">
              <i class="el-icon-setting mr-2"></i>
              设置
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <el-skeleton animated rows="4" class="skeleton-loader"></el-skeleton>
    </div>

    <!-- 客户端快捷访问卡片 -->
    <div v-else class="client-card mb-6">
      <div class="card-header">
        <h3 class="card-title">系统快捷访问</h3>
        <el-tooltip content="点击访问相关系统" placement="top">
          <i class="el-icon-question-circle-o"></i>
        </el-tooltip>
      </div>
      <div class="client-grid">
        <a v-for="(item, index) in ssoClient" :key="index" :href="item.url" target="_blank" class="client-item">
          <div class="client-icon">
            <i class="el-icon-s-claim"></i>
          </div>
          <span class="client-name">{{ item.clientName }}</span>
        </a>
      </div>
    </div>

    <!-- 统计卡片区域 -->
    <div class="stats-container">
      <!-- 在线统计卡片 -->
      <el-card class="stat-card">
        <template #header>
          <div class="card-header">
            <h3 class="card-title">在线统计</h3>
            <el-tooltip content="实时更新的在线用户数据" placement="top">
              <i class="el-icon-question-circle-o"></i>
            </el-tooltip>
          </div>
        </template>
        <div class="card-content">
          <login-user-bar />
        </div>
      </el-card>

      <!-- 系统总览卡片 -->
      <el-card class="stat-card">
        <template #header>
          <div class="card-header">
            <h3 class="card-title">系统总览</h3>
            <el-tooltip content="系统运行状态概览" placement="top">
              <i class="el-icon-question-circle-o"></i>
            </el-tooltip>
          </div>
        </template>
        <div class="card-content">
          <div class="stat-items">
            <div class="stat-item">
              <div class="stat-label">
                <div class="status-dot status-green"></div>
                <span>系统状态</span>
              </div>
              <span class="stat-value status-green">正常运行中</span>
            </div>
            <div class="stat-item">
              <div class="stat-label">
                <div class="status-dot status-blue"></div>
                <span>响应时间</span>
              </div>
              <div class="stat-value">
                <el-progress :percentage="85" :stroke-width="16" :width="100" status="success" />
                <span class="ml-3">优秀</span>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-label">
                <div class="status-dot status-orange"></div>
                <span>存储空间</span>
              </div>
              <div class="stat-value">
                <el-progress :percentage="60" :stroke-width="16" :width="100" status="warning" />
                <span class="ml-3">60%</span>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-label">
                <div class="status-dot status-purple"></div>
                <span>请求成功率</span>
              </div>
              <div class="stat-value">
                <el-progress :percentage="99" :stroke-width="16" :width="100" status="success" />
                <span class="ml-3">99.2%</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:math';

// 颜色变量
$primary: #165dff;
$secondary: #4080ff;
$success: #52c41a;
$warning: #faad14;
$info: #1890ff;
$danger: #ff4d4f;
$gray-100: #f5f7fa;
$gray-200: #e4e7ed;
$gray-300: #dcdfe6;
$gray-400: #c0c4cc;
$gray-500: #909399;
$gray-600: #606266;
$gray-700: #303133;
$gray-800: #1e1e1e;

// 动画
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 基础样式
.home-container {
  max-width: 100%;
  padding: 2rem 1rem 4rem;
  margin: 0 auto;
}

// 欢迎卡片样式
.welcome-card {
  overflow: hidden;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgb(0 0 0 / 10%);
  opacity: 0;
  animation: fadeIn 0.5s ease forwards 0.1s;
}

.welcome-content {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  @media (width >= 768px) {
    flex-direction: row;
    align-items: center;
  }
}

.avatar-wrapper {
  margin-bottom: 1.5rem;
  @media (width >= 768px) {
    margin-right: 2rem;
    margin-bottom: 0;
  }
}

.avatar {
  border: 4px solid rgb(255 255 255 / 20%);
  box-shadow: 0 8px 20px rgb(0 0 0 / 15%);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.welcome-text {
  text-align: center;
  @media (width >= 768px) {
    text-align: left;
  }
}

.welcome-title {
  margin-bottom: 0.5rem;
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: bold;
  letter-spacing: -0.025em;
}

.welcome-subtitle {
  max-width: 40rem;
  margin-bottom: 1rem;
  font-size: 1.125rem;
  color: rgb(255 255 255 / 80%);
}

.welcome-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  @media (width >= 768px) {
    justify-content: flex-start;
  }
}

.action-btn {
  color: white;
  background-color: rgb(255 255 255 / 20%);
  border: 1px solid rgb(255 255 255 / 30%);
  transition: all 0.3s ease;

  &:hover {
    background-color: rgb(255 255 255 / 30%);
    box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
    transform: translateY(-1px);
  }
}

.action-btn-text {
  color: rgb(255 255 255 / 90%);
  transition: all 0.3s ease;

  &:hover {
    color: white;
    transform: translateY(-1px);
  }
}

// 加载状态样式
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
}

.skeleton-loader {
  width: 100%;
  max-width: 50rem;
}

// 客户端卡片样式
.client-card {
  overflow: hidden;
  border: 0;
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgb(0 0 0 / 5%);
  opacity: 0;
  transition: all 0.3s ease;
  animation: slideUp 0.5s ease forwards 0.2s;

  &:hover {
    box-shadow: 0 8px 25px rgb(0 0 0 / 10%);
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #303133;
}

.client-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1.5rem;

  @media (width >= 640px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (width >= 768px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (width >= 1024px) {
    grid-template-columns: repeat(5, 1fr);
  }
}

.client-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  text-decoration: none;
  background-color: white;
  border: 1px solid #f0f0f0;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgb(0 0 0 / 5%);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgb(22 93 255 / 20%);
    box-shadow: 0 6px 16px rgb(0 0 0 / 8%);
    transform: translateY(-4px);
  }
}

.client-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  margin-bottom: 0.75rem;
  background-color: rgb(22 93 255 / 10%);
  border-radius: 50%;
  transition: background-color 0.3s ease;

  .client-item:hover & {
    background-color: rgb(22 93 255 / 20%);
  }

  i {
    font-size: 1.5rem;
    color: #165dff;
  }
}

.client-name {
  max-width: 100%;
  overflow: hidden;
  font-weight: 500;
  color: #333;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease;

  .client-item:hover & {
    color: #165dff;
  }
}

// 统计卡片区域
.stats-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (width >= 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-card {
  overflow: hidden;
  border: 0;
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgb(0 0 0 / 5%);
  opacity: 0;
  transition: all 0.3s ease;
  animation: slideUp 0.5s ease forwards 0.3s;

  &:hover {
    box-shadow: 0 8px 25px rgb(0 0 0 / 10%);
  }
}

.card-content {
  padding: 1.5rem;
}

.stat-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-label {
  display: flex;
  align-items: center;
}

.status-dot {
  width: 0.75rem;
  height: 0.75rem;
  margin-right: 0.5rem;
  border-radius: 50%;
}

.status-green {
  background-color: #52c41a;
}

.status-blue {
  background-color: #1890ff;
}

.status-orange {
  background-color: #faad14;
}

.status-purple {
  background-color: #722ed1;
}

.stat-value {
  font-weight: 500;

  .el-progress {
    display: inline-block;
    margin-right: 0.75rem;
  }

  .el-progress-circle {
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
}
</style>
