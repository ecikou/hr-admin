import router from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
// 白名单，如果有就直接放行
const whitelist = ['/login', '/404']
// 前置路由守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const token = store.state.user.token
  if (token) {
    if (to.path === '/login') {
      NProgress.done()
      next('/')
    } else {
      if (!store.state.user.userInfo.id) {
        const { roles } = await store.dispatch('user/getInfo')
        console.log(roles.menus)
        const newRoutes = await store.dispatch('permission/filter', roles.menus)
        router.addRoutes([...newRoutes, { path: '*', redirect: '/404', hidden: true }])
        // asyncRoutes.filter()
        next(to.path)
      }
      next()
    }
  } else {
    if (whitelist.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
// 后置路由守卫
router.afterEach(() => {
  NProgress.done()
})
