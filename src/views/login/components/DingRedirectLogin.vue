<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import useUserStore from '@/store/modules/user'
import { SelectData } from '@/types/types.ts'
import { dingTalkAuth } from '@/api/login'
import { selectTenant } from '@/api/auth/tenant'
import { useMessage } from '@/hooks/message'

const userStore = useUserStore()
const tenantOption = ref<SelectData[]>()
let authCode = ref<string>('')

/**
 * 初始化租户下拉框
 */
const initSelectTenant = async () => {
  try {
    const response: any = await selectTenant()
    tenantOption.value = response.data
  } catch (err: any) {
    useMessage().error(err.message)
  }
}
/**
 * 初始化
 */
onMounted(async () => {
  await initSelectTenant()
  const searchParams = new URLSearchParams(window.location.search)
  authCode.value = searchParams.get('authCode') || ''
})

const dingSsoLogin = async (val: SelectData) => {
  userStore.storeTenantId(val.value)
  // 原生 JavaScript 获取参数
  const searchParams = new URLSearchParams(window.location.search)
  const code = searchParams.get('code')
  const state = searchParams.get('state') || ''
  authCode.value = searchParams.get('authCode') || ''

  console.log('获取 code 参数：', code)
  console.log('获取 authCode 参数：', authCode)
  console.log('获取 state 状态：', state)
  if (authCode.value) {
    const response: any = await dingTalkAuth(authCode.value)
    if (response.data.code !== '0000') {
      useMessage().error('登录失败，请稍后再试')
      return
    }
    await userStore.storeLoginInfo(response.data.access_token)
    await userStore.storeUserInfo()
    window.location.replace(`${window.location.protocol}//${window.location.host}`)
  }
}

/**
 * 获取当前租户
 */
const tenantId = computed({
  get: () => {
    return userStore.tenantId
  },
  set: (value) => {
    userStore.storeTenantId(value)
  },
})

/**
 * 获取当前租户
 */
const handleSwitchLoginType = () => {
  window.location.href = '/'
}
</script>

<template>
  <!-- 钉钉登录场景容器 -->
  <div class="ding-login-container">
    <div class="ding-card">
      <div class="ding-header">
        <div class="ding-title">选择你管理的组织</div>
        <div class="ding-subtitle">你在以下组织中担任管理员</div>
      </div>
      <div class="ding-list">
        <div
          v-for="(item, index) in tenantOption"
          :key="index"
          class="ding-item"
          @click="dingSsoLogin(item)"
          :class="{ 'last-login': item.value === tenantId }"
        >
          <div class="ding-item-left">
            <div class="ding-org-icon">
              <i class="el-icon-building" />
            </div>
            <div class="ding-org-info">
              <div class="ding-org-name">{{ item.label }}</div>
              <!-- <div class="last-login-tag" v-if="item.value === tenantId">上次登录</div> -->
            </div>
          </div>
          <i class="el-icon-arrow-right ding-arrow" />
        </div>
      </div>
      <div class="ding-footer">
        <el-button type="text" size="small" @click="handleSwitchLoginType" class="ding-switch-btn">
          <i class="el-icon-arrow-left" />
          切换登录方式
        </el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 钉钉登录容器
.ding-login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  padding: 20px;
  background: radial-gradient(circle at 48.7% 44.3%, #fefefe 10.5%, #b5eff9 50%);

  // 卡片容器
  .ding-card {
    width: 100%;
    max-width: 380px;
    overflow: hidden;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgb(0 0 0 / 8%);
    transition: all 0.3s ease;

    // 鼠标悬停效果
    &:hover {
      box-shadow: 0 15px 30px rgb(0 0 0 / 12%);
    }

    // 头部区域
    .ding-header {
      padding: 24px 24px 16px;

      .ding-title {
        margin-bottom: 8px;
        font-size: 18px;
        font-weight: 600;
        color: #333;
      }

      .ding-subtitle {
        font-size: 13px;
        color: #666;
      }
    }

    // 列表区域
    .ding-list {
      max-height: 300px;
      overflow-y: auto;

      // 自定义滚动条
      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 10px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
      }
    }

    // 列表项
    .ding-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      cursor: pointer;
      border-bottom: 1px solid #f0f0f0;
      transition: all 0.2s ease;

      // 鼠标悬停效果
      &:hover {
        background-color: #f8fafc;
      }

      // 左侧内容
      .ding-item-left {
        display: flex;
        align-items: center;
      }

      // 组织图标
      .ding-org-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        margin-right: 12px;
        background-color: #e6f4ff;
        border-radius: 50%;

        i {
          font-size: 16px;
          color: #409eff;
        }
      }

      // 组织信息
      .ding-org-info {
        .ding-org-name {
          margin-bottom: 2px;
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .last-login-tag {
          display: inline-block;
          padding: 1px 4px;
          font-size: 11px;
          color: #606266;
          background-color: #f0f2f5;
          border-radius: 3px;
        }
      }

      // 右侧箭头
      .ding-arrow {
        font-size: 14px;
        color: #c0c4cc;
        transition: transform 0.2s ease;
      }

      // 上次登录的组织高亮
      &.last-login {
        background-color: #f5f7fa;

        .ding-arrow {
          color: #409eff;
          transform: translateX(3px);
        }

        .ding-org-name {
          font-weight: 600;
        }
      }
    }

    // 底部区域
    .ding-footer {
      padding: 12px 24px;
      text-align: left;

      .ding-switch-btn {
        color: #606266;
        transition: color 0.2s ease;

        i {
          margin-right: 4px;
        }

        &:hover {
          color: #409eff;
        }
      }
    }
  }
}
</style>
