<script setup lang="ts">
import { onMounted } from 'vue'
import setting from '@/setting.ts'

onMounted(async () => {
  window.location.href = `https://login.dingtalk.com/oauth2/auth?redirect_uri=${setting.dingLogin.redirectUri}&response_type=code&client_id=${setting.dingLogin.clientId}&scope=openid&state=${setting.dingLogin.state}&prompt=consent`
})
</script>
