/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
export const loginRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true,
    },
  },
  {
    path: '/simple-login',
    name: 'SimpleLogin',
    component: () => import('@/views/login/simple-login/index.vue'),
    meta: {
      title: '登录',
      hidden: true,
    },
  },
  {
    path: '/ding-scan',
    name: 'DingScan',
    component: () => import('@/views/login/ding-scan/index.vue'),
    meta: {
      title: '',
      icon: '',
      hidden: true,
      type: 1,
      href: 0,
    },
  },
  {
    path: '/sso',
    name: 'Sso',
    component: () => import('@/views/login/sso/index.vue'),
    meta: {
      title: '',
      icon: '',
      hidden: true,
      type: 1,
      href: 0,
    },
  },
  {
    path: '/ding-auth',
    name: 'DingAuth',
    component: () => import('@/views/login/ding-auth/index.vue'),
    meta: {
      title: '',
      icon: '',
      hidden: true,
      type: 1,
      href: 0,
    },
  },
  {
    path: '/sso-login',
    name: 'SsoLogin',
    component: () => import('@/views/login/sso/sso-login/index.vue'),
    meta: {
      title: 'sso登录',
      icon: 'sso-login',
      hidden: true,
      type: 1,
      href: 0,
    },
  },
]

export const constantChildRoutes = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '主页',
      icon: 'home',
      hidden: false,
      type: 1,
      href: 0,
    },
  },
  {
    path: 'tabWrapper/:pageId/:type/:path/:_t',
    component: () => import('@/components/TabWrapper/index.vue'),
    name: 'TabWrapper',
    props: true,
    meta: {
      title: '',
      icon: '',
      hidden: true,
      type: 1,
      href: 0,
    },
  },
  {
    path: '/screen',
    name: 'Screen',
    component: () => import('@/views/screen/index.vue'),
    meta: {
      title: 'Screen',
      icon: 'screen',
      hidden: false,
      type: 1,
      href: 0,
    },
  },
  {
    path: '/screen2',
    name: 'Screen2',
    component: () => import('@/views/screen/index_v2.vue'),
    meta: {
      title: 'Screen',
      icon: 'screen',
      hidden: false,
      type: 1,
      href: 0,
    },
  },
  {
    path: '/screen3',
    name: 'Screen3',
    component: () => import('@/views/screen/index_v3.vue'),
    meta: {
      title: 'Screen',
      icon: 'screen',
      hidden: false,
      type: 1,
      href: 0,
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index.vue'),
    meta: {
      title: '404',
      hidden: true,
      type: 1,
      href: 0,
    },
  },
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'Any',
  //   redirect: '/404',
  //   meta: {
  //     title: '任意路由',
  //     hidden: true,
  //   },
  // },
]

export const constantRoutes = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '',
      hidden: false,
      type: 0,
      href: 0,
    },
    redirect: '/home',
    children: constantChildRoutes,
  },
]
