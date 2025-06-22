<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(async () => {
  await initDingLogin()
})
/**
 * 钉钉扫码登录二维码初始化
 */
const initDingLogin = async () => {
  if (window.DTFrameLogin) {
    const corpId = 'ding3add055d290d32c1f5bf40eda33b7ba0'
    const clientId = 'dingmdfbjobhznnpqsy4'
    window.DTFrameLogin(
      {
        id: 'self_defined_element',
        width: 300,
        height: 300,
      },
      {
        // 注意：redirect_uri 需为完整URL，扫码后钉钉会带code跳转到这里
        redirect_uri: encodeURIComponent('https://22i24277w6.51vip.biz/#/'),
        client_id: clientId,
        scope: 'openid corpid',
        response_type: 'code',
        state: '1',
        prompt: 'consent',
        corpId: corpId,
      },
      (loginResult: any) => {
        const { redirectUrl, authCode, state } = loginResult
        console.log(state)
        // 这里可以直接进行重定向
        window.location.href = redirectUrl
        console.log(authCode)
      },
      (errorMsg: any) => {
        // 这里一般需要展示登录失败的具体原因
        alert(`Login Error: ${errorMsg}`)
      },
    )
  } else {
    setTimeout(initDingLogin, 100)
  }
}
</script>
<template>
  <div class="ding-scan-login-container">
    <!-- 登录主容器 - 优化居中布局 -->
    <div class="login-main-layout">
      <div class="login-container">
        <div class="login-title">钉钉扫码登录</div>
        <div id="self_defined_element" class="qr-code-container"></div>
        <div class="login-tip">请使用钉钉App扫描二维码登录</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 全局应用包装器 - 确保整体居中 */
.ding-scan-login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: #f9fafb;
}

/* 登录主布局 - 优化居中逻辑 */
.login-main-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.login-container {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
  padding: 40px 40px 30px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

/* 容器悬浮动效增强 */
.login-container:hover {
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.12);
  transform: translateY(-5px);
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd, #60a5fa, #3b82f6);
  animation: borderShine 3s linear infinite;
  background-size: 300% 100%;
}

@keyframes borderShine {
  0% {
    background-position: 0% 0;
  }
  100% {
    background-position: 300% 0;
  }
}

.login-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 28px;
  letter-spacing: 0.8px;
  border-left: 4px solid #3b82f6;
  padding-left: 12px;
  align-self: flex-start;
  position: relative;
}

.login-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 40px;
  height: 2px;
  background-color: #3b82f6;
  border-radius: 2px;
}

/* 二维码容器 - 视觉升级 */
.qr-code-container {
  width: 300px;
  height: 300px;
  margin-bottom: 20px;
  background: #f8fafc;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border: 1px solid #e0e7ff;
}

/* 二维码容器背景动效 */
.qr-code-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 20%),
    radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.1) 0%, transparent 20%);
  z-index: 1;
}

/* 提示文本 - 交互优化 */
.login-tip {
  color: #4b5563;
  font-size: 15px;
  margin-top: 12px;
  background: #f1f5f9;
  border-radius: 10px;
  padding: 10px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  align-self: center;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.login-tip:hover {
  background: #e2e8f0;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-tip i {
  margin-right: 8px;
  color: #3b82f6;
}

/* 响应式设计 - 优化移动端体验 */
@media (max-width: 480px) {
  .header-stripes {
    height: 60px;
    margin-bottom: 30px;
  }

  .header-title {
    font-size: 22px;
  }

  .login-container {
    padding: 30px 30px 25px;
    max-width: 340px;
  }

  .login-title {
    font-size: 22px;
    margin-bottom: 24px;
  }

  .qr-code-container {
    width: 260px;
    height: 260px;
  }

  .login-tip {
    font-size: 14px;
    padding: 8px 16px;
  }
}
</style>
