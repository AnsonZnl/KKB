import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import List from '../views/List.vue'
import Detail from '../views/Detail.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  }, 
   {
    path: '/list',
    name: 'List',
    component: List,
    children:[
      {path: '/detail/:id', name:"Detail", component : Detail, props: true}
    ]
  },
  {
    path: '/about',
    name: 'About',
    meta: {auth: true},//需要验证
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),//懒加载
    children:[//子路由
      {path: '/list', component: List}
    ]
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   meta: {auth: true},//需要验证
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),//懒加载
  //   hildren:[//子路由
  //     {path: '/list', component: List}
  //   ]
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,//
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next)=>{
  // 要访问 about 且未登录需要去登录
  // 判断登录状态，存在则登录，
  if(to.meta.auth && !window.isLogin){
      if(window.confirm('请登录')){
        window.isLogin = true;
        next();//登录成功 继续
      }else{
        next('/');// 放弃登录 会首页
      }
  }else{
    next();// 不需要登录，继续
  }
})


export default router
