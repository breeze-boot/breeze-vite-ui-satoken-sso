<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <div class="login-form-card">
        <div class="login-header">
          <h1>系统登录</h1>
          <p>请输入账号密码登录系统</p>
        </div>

        <el-form ref="loginFormRef" :model="form" :rules="rules" label-width="0" class="login-form">
          <el-form-item label="" prop="username">
            <el-input
              v-model="form.username"
              placeholder="请输入用户名"
              :disabled="loading"
              prefix-icon="el-icon-user"
            />
          </el-form-item>

          <el-form-item label="" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              :disabled="loading"
              prefix-icon="el-icon-lock"
              show-password
            />
          </el-form-item>

          <el-form-item label="" prop="tenantId">
            <el-select v-model="form.tenantId" placeholder="请选择租户" style="width: 100%" filterable>
              <el-option v-for="item in tenantOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item style="text-align: center; margin-top: 30px">
            <el-button
              @click="handleLogin"
              :loading="loading"
              type="primary"
              :style="{ width: '100%', height: '48px', fontSize: '16px', fontWeight: '500' }"
              :class="{ 'btn-pulse': !loading }"
            >
              登 录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="login-footer">
          <div class="tenant-info">
            <span>当前租户:</span>
            <span class="tenant-name">{{ tenantName }}</span>
          </div>
          <div class="copyright">© {{ new Date().getFullYear() }} 系统版权所有</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { SelectData } from '@/types/types.ts'

const $router = useRouter()

// 表单状态
const form = reactive({
  username: '',
  password: '',
  tenantId: '',
})

// 组件状态
const tenantOptions = ref<SelectData[]>([])
const loading = ref(false)
const rules = ref({
  tenantId: [{ required: true, message: '请选择租户', trigger: 'change' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})
const loginFormRef = ref<any>()

// 获取当前租户名称
const tenantName = computed(() => {
  const selected = tenantOptions.value.find((item) => item.value === form.tenantId)
  return selected ? selected.label : '未选择'
})

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return
  const valid = await loginFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    // 模拟登录接口
    await new Promise((resolve) => setTimeout(resolve, 1500))

    ElMessage.success('登录成功')
    await $router.push({ path: '/' })
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '登录失败，请检查账号密码')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
/* 现代配色方案 - 采用深色调与高对比度元素 */
$primary-color: #409eff; /* 主色调 - 柔和蓝色 */
$primary-dark: #3083e0; /* 主色深色 */
$primary-light: #e6f7ff; /* 主色浅色 */
$secondary-color: #67c23a; /* 辅助色 - 成功绿色 */
$text-primary: #303133; /* 主文本色 */
$text-secondary: #606266; /* 次文本色 */
$border-color: #dcdfe6; /* 边框色 */
$bg-primary: #ffffff; /* 主背景色 */
$bg-secondary: #f5f7fa; /* 次背景色 */
$input-focus: #409eff; /* 输入框聚焦色 */
$shadow-light: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
$shadow-medium: 0 4px 24px 0 rgba(0, 0, 0, 0.12);
$transition: all 0.3s ease;

.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

  /* 背景装饰元素 - 现代几何图形 */
  &::before,
  &::after {
    content: '';
    position: absolute;
    z-index: 0;
    opacity: 0.08;
  }

  &::before {
    top: 20%;
    left: 5%;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: $primary-color;
  }

  &::after {
    bottom: 15%;
    right: 8%;
    width: 200px;
    height: 200px;
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    background: $secondary-color;
  }

  .login-form-wrapper {
    width: 100%;
    max-width: 420px;
    position: relative;
    z-index: 1;

    .login-form-card {
      background: $bg-primary;
      border-radius: 24px;
      box-shadow: $shadow-medium;
      overflow: hidden;
      transition: $transition;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.15);
      }

      .login-header {
        padding: 45px 40px 35px;
        text-align: center;
        background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
        color: white;
        border-radius: 0 0 30px 30px;
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          bottom: -50px;
          right: -50px;
          width: 120px;
          height: 120px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }

        h1 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 12px;
          position: relative;
          z-index: 1;
        }

        p {
          font-size: 16px;
          opacity: 0.9;
          margin: 0;
          position: relative;
          z-index: 1;
        }
      }

      .login-form {
        padding: 40px;

        .el-form-item {
          margin-bottom: 28px;

          .el-input {
            height: 50px;
            border-radius: 12px;
            transition: $transition;

            &:focus-within {
              .el-input__inner {
                border-color: $input-focus;
                box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.2);
              }
            }

            .el-input__inner {
              height: 50px;
              font-size: 16px;
              border-radius: 12px;
              border-color: $border-color;
              background-color: $bg-secondary;
              transition: $transition;
              padding-left: 45px;
            }

            .el-input__prefix {
              line-height: 50px;
              color: $text-secondary;
              width: 40px;
              text-align: center;
              font-size: 18px;
            }

            .el-input__suffix {
              line-height: 50px;
              color: $text-secondary;
              width: 40px;
              text-align: center;
              font-size: 18px;
              cursor: pointer;

              &:hover {
                color: $primary-color;
              }
            }
          }
        }
      }

      .login-footer {
        padding: 25px 40px 30px;
        background-color: $bg-secondary;
        border-top: 1px solid $border-color;
        display: flex;
        flex-direction: column;
        gap: 10px;
        border-radius: 0 0 24px 24px;

        .tenant-info {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: $text-primary;

          .tenant-name {
            color: $primary-color;
            margin-left: 8px;
            font-weight: 500;
          }
        }

        .copyright {
          text-align: center;
          font-size: 13px;
          color: $text-secondary;
          opacity: 0.8;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 450px) {
  .login-container {
    padding: 15px;
  }

  .login-form-card {
    .login-header {
      padding: 35px 30px 25px;

      h1 {
        font-size: 28px;
      }
    }

    .login-form {
      padding: 30px 25px;
    }

    .login-footer {
      padding: 20px 25px 25px;
    }
  }
}

// 动画效果
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

.btn-pulse {
  animation: pulse 2s infinite;
}
</style>
