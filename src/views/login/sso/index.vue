<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import useUserStore from '@/store/modules/user'
import useSettingStore from '@/store/modules/setting'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import Verify from '@/components/anj-plus/Verify.vue'
import SvgButton from '@/components/SvgButton/index.vue'
import { SelectData } from '@/types/types.ts'
import { selectTenant } from '@/api/auth/tenant'
import { useMessage } from '@/hooks/message'

let $router = useRouter()
let settingStore = useSettingStore()
let { settings } = storeToRefs(settingStore)
let loading = ref(false)
const userStore = useUserStore()

// 单点登录地址
const loginUrl = '/sso-login?back=' + encodeURIComponent(location.href)

/**
 * 初始化
 */
onMounted(async () => {
  await initSelectTenant()
  // const res: any = await checkIsLogin()
  // if (res.data) {
  //   await $router.push(loginUrl)
  // }
})

const tenantOption = ref<SelectData[]>()

const tenant = ref<any>()
const open = ref(false)

const verify = ref<any>()
const captchaType = ref('clickWord')
const handleCheck = () => {
  handleOnShow('blockPuzzle')
  // handleOnShow('clickWord')
}

const handleOnShow = (type: any) => {
  captchaType.value = type
  verify.value?.show()
}

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
 * 标题动态获取计算属性
 */
const title = computed(() => {
  return settings.value.title
})

const handleToSsoLogin = () => {
  if (!tenantId.value) {
    open.value = true
    return
  }
  $router.push(loginUrl)
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
const tenantName = computed(() => {
  return tenantOption.value?.find((item) => item?.value === tenantId.value)?.label
})
</script>

<template>
  <!-- SSO登录场景容器 -->
  <div class="sso-login-container" @keyup.enter="handleCheck">
    <div class="sso-login">
      <el-popover placement="bottom" trigger="hover">
        <el-select
          :teleported="false"
          @change="() => userStore.storeTenantId(tenantId)"
          v-model="tenantId"
          style="width: 120px"
        >
          <el-option v-for="item in tenantOption" :key="item?.value" :label="item?.label" :value="item?.value" />
        </el-select>
        <template #reference>
          <svg-button
            ref="tenant"
            :style="{ background: 'transparent !important', border: 'transparent !important' }"
            :circle="true"
            icon="tenant"
            width="2rem"
            height="2rem"
          />
        </template>
      </el-popover>
    </div>

    <div class="login-form-card">
      <h1>{{ title }}</h1>
      <svg-button
        @svg-btn-click="handleToSsoLogin"
        :style="{ background: 'transparent !important' }"
        :circle="true"
        :loading="loading"
        icon="login"
        width="10rem"
        height="10rem"
        type="primary"
      />
      <div class="tenant-name">{{ tenantName }}</div>
    </div>
    <el-tour content-style="width: 200px" v-model="open">
      <el-tour-step :target="tenant?.$el" title="租户">请选择租户</el-tour-step>
    </el-tour>
    <Verify
      mode="pop"
      @success="() => {}"
      :captchaType="captchaType"
      :imgSize="{ width: '400px', height: '200px' }"
      ref="verify"
    />
  </div>
</template>

<style lang="scss" scoped>
.sso-login-container {
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at 48.7% 44.3%, #fefefe 10.5%, #b5eff9 50%);

  .sso-login {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 100;
  }

  .login-form-card {
    border: none;
    position: absolute;
    top: 20vh;
    left: 50%;
    width: 28rem;
    height: 25rem;
    transform: translateX(-50%);
    display: flex;
    justify-items: center;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    h1 {
      margin-top: -10px;
      margin-bottom: 100px;
      font-size: 40px;
      font-weight: 700;
      text-align: center;
      background: linear-gradient(to right, blue, rgb(35 60 70));
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .tenant-name {
      position: absolute;
      bottom: 0;
      text-align: center;
      width: 100%;
      height: 50px;
      padding: 10px;
      z-index: 999;
    }
  }
}

.el-card {
  box-shadow: rgba(0, 0, 0, 0.24) 0 0 3px;
}

:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
