import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "../store"
Vue.use(VueRouter)
//路由独享守卫封装
function routerFun(path, next) {
  if (store.state.user.menus_url.find(item => item == path)) {
    next()
  } else {
    next("/index/home")
  }
}

export const indexRouter = [
  {
    path: "menu",
    component: () => import("../pages/menu/menu.vue"),
    meta: {
      title: "菜单管理"
    },
    beforeEnter(to, form, next) {
      routerFun("menu", next)
    }
  },
  {
    path: "role",
    component: () => import("../pages/role/role.vue"),
    meta: {
      title: "角色管理"
    },
    beforeEnter(to, form, next) {
      routerFun("role", next)
    }
  },
  {
    path: "admin",
    component: () => import("../pages/admin/admin.vue"),
    meta: {
      title: "管理员管理"
    },
    beforeEnter(to, form, next) {
      routerFun("admin", next)
    }
  },
  {
    path: "cate",
    component: () => import("../pages/cate/cate.vue"),
    meta: {
      title: "商品分类"
    },
    beforeEnter(to, form, next) {
      routerFun("cate", next)
    }
  },
  {
    path: "specs",
    component: () => import("../pages/specs/specs.vue"),
    meta: {
      title: "商品规格"
    },
    beforeEnter(to, form, next) {
      routerFun("specs", next)
    }
  },
  {
    path: "shop",
    component: () => import("../pages/shop/shop.vue"),
    meta: {
      title: "商品管理"
    },
    beforeEnter(to, form, next) {
      routerFun("shop", next)
    }
  },
  {
    path: "member",
    component: () => import("../pages/member/member.vue"),
    meta: {
      title: "会员管理"
    },
    beforeEnter(to, form, next) {
      routerFun("member", next)
    }
  },
  {
    path: "banner",
    component: () => import("../pages/banner/banner.vue"),
    meta: {
      title: "轮播图管理"
    },
    beforeEnter(to, form, next) {
      routerFun("banner", next)
    }
  },
  {
    path: "seckill",
    component: () => import("../pages/seckill/seckill.vue"),
    meta: {
      title: "秒杀活动"
    },
    beforeEnter(to, form, next) {
      routerFun("seckill", next)
    }
  },
]
const routes = [
  //配置一级路由规则
  {
    path: "/login",
    component: () => import("../pages/login/login.vue")
  },
  {
    path: "/index",
    component: () => import("../pages/index/index.vue"),
    children: [
      {
        path: "home",
        component: () => import("../pages/home/home.vue")
      },
      // 遍历IndexRoutes
      ...indexRouter,
      {
        path: "",
        redirect: "home"
      }
    ]
  },
  {
    path:"*",
    redirect:"/index"
  }
]

const router = new VueRouter({
  routes
})
//全局前置守卫，router.beforeEach
router.beforeEach((to, from, next) => {
  //判断去的路径是不是login
  if (to.path == "/login") {
    next();
    return;
  }
  //判断是否已经登录
  if (store.state.user.token) {
    next();
    return;
  }
  //如果没有登录并且不是去登陆页面就强制去登录页面
  next("/login")
})
export default router
