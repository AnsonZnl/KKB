## Vue-Router
[Vue Router](https://router.vuejs.org/zh/installation.html) 是 Vue.js 官方的路由管理器。它和 Vue.js 的核心深度集成，让构建单页面应用变得易如反掌。包含的功能有：
- 嵌套的路由/视图表
- 模块化的、基于组件的路由配置
- 路由参数、查询、通配符
- 细粒度的导航控制
- 带有自动激活的 CSS class 的链接
- HTML5 历史模式或 hash 模式，在 IE9 中自动降级
- 自定义的滚动条行为

### 安装
```
vue create demo
vue add router
cd demo 
npm run serve
open browser http://localhost:8080/
```

## 使用vue-router

- router配置

```js
// router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import List from '../views/List.vue'

Vue.use(VueRouter)//引入Router插件

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    //懒加载
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    children:[
      //子路由
      {path: '/list', component: List}
    ]
  }
]

const router = new VueRouter({
  mode: 'history',// 使用模式： hash | history | abstract 
  base: process.env.BASE_URL,// 基础路径 
  routes
})

export default router

```

- 指定路由器

  ```
  // main.js
  new Vue({
      router,
      render: h=>h(App)
  }).$mount('#app')
  ```

- 路由视图

  ```
  <router-view/>
  ```

- 路由导航

  ```
  <router-link to='/list'></router-link>
  ```

- 路由嵌套（有路由children的嵌套，就必定有<router-view>的嵌套）

  ```
    //router/index.js
    {
      path: '/',
      name: 'Home',
      component: Home,
      children:[
          {path: '/list', name: 'list', component: List}
      ]
    },
    // 父组件 添加插座 Home.vue
    <template>
    <div class="home">
    	<h1>首页</h1>
    	<router-view></router-view>
    <div>
    </template>
  ```

  

### 动态路由

我们经常需要把某种模式匹配到的所有路由，全都映射到同一个组件。

详情页路由配置，router/index.js

```vue
{
  path: '/',
  component: Home,
  children:[
    {path: '', name: 'home', component: List},
    {path: 'detail/:id', component: Detail}
     // 就是一种正则匹配，会匹配 /detail...之后的数据
  ]
}
```

跳转，List.vue

```html
<ul>
    <li><router-link to="/detail/1">Web全栈</router-link></li>
<ul>
```

获取参数，Detail.vue

```html
<template>
 <div>
   <h2>商品详情</h2>    
   <p>{{$route.params.id}}</p>
 </div>
</template>
```

传递路由组件参数：

```js
{path: 'detail/:id', component: Detail, props: true}
```

组件中以属性方式获取

```js
export default {props: ['id']}
```

### 路由守卫

路由导航过程中有若干生命周期狗子，可以在这里实现逻辑控制。

全局守卫，router.js

```js


const routes = [
  {
    path: '/about',
    name: 'About',
    meta: {auth: true},//需要验证
    component: About,//懒加载
    children:[//子路由
      {path: '/list', component: List}
    ]
  }
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

```

路由独享守卫

```
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      // ...
    }
  }, 
```

组件内的守卫

```
export default {
    beforeRouteEnter(to, from, next){},
    beforeRouteUpdate(to, from, next){},
    beforeRouteLeave(to, from, next){}
}
```

### vue-router扩展（动态路由）

利用$router.addRoutes()可以实现动态路由添加，常用于**用户权限控制**。

不同用户的角色权限不同，来动态的显示链接和页面。

```js
// router.js

// 异步获取 用户权限 和 路由列表
api.getRoutes().then(routes => {
    const routeConfig = routes.map(route => mapComponent(route))
    router.addRoutes(routeConfig);
  }
})
/**  返回的数据可能是这样
[
  {
  path: '/',
  name: 'home',
  component: 'Home', //Home
  }
]
**/
// 递归替换
function mapComponent(route){
    route.component = compMap[route.component];
    if(route.children){
      route.children = route.children.map(child => mapComponent(child))
    }
    return route;
}

// 映射关系
const compMap = {
    // "Home": Home
    "Home" : () => import('./view/Home.vue')
}

```

### 面包屑

利用`$route.matched`可得到路由匹配数组，按顺序解析可得路由层次关系。

```js
        // Breadcrumb.vue
        watch: {
            $route: { //route发生变化之后 
                handler() {
                    // [{name: 'home', path: '/' },{name: 'list', path:'/list'}]
                    console.log(this.$route.matched); // 列出 所有嵌套的路由
                    // ['home','list']
                    this.crumbData = this.$route.matched.map(m => m.name || m.redirect)
                },
                immediate: true//一开始就执行
            }
        }
```

### vue-router源码实现

#### 通常用法

```js
// kvue-router
let Vue;

class VueRouter {
    constructor(options) {
        this.$options = options;
        this.routeMap = {};
        // 创建一个路由path 和route的映射
        this.app = new Vue({
            // 利用vue的双向数据原理，绑定一个当前的url，默认是 /
            //将来当前的路径current需要响应式，利用vue的响应式可以做的这一点
            data: {
                current: '/'
            }
        })
    }
    // 绑定事件
    init() {
        // 绑定浏览器事件
        this.bindEvents();
        //解析路由配置
        this.createRouteMap(this.$options);
        // 初始化router-link和router-link组件
        this.initComponent();
    }
    bindEvents() {
        // 页面刷新 和 url路径变化时触发事件
        window.addEventListener('load', this.onHashChange.bind(this), false);
        window.addEventListener('hashchange', this.oonHashChange.bind(this), false)
    }
    //路由映射表
    createRouterMap(options) {
        options.routes.forEach(item => {
            this.routeMap[item.path] = item;
            //this.routeMap.'/' = {path: '/', component: Home},
        })
    }
    // 初始化<router-link>和<route-view>组件
    initComponent() {
        // 声明两个全局组件
        Vue.component('router-link', {
            props: {
                to: String
            },
            render(h) {
                // 目标是：<a :href="to">
                // return <a href={this.to}>{this.$slots.default}</a>
                return h('a', {
                    attrs: {
                        href: '#' + this.to
                    }
                }, [
                    this.$slots.default
                ])
            }
        })
        //  hash -> onHasChange -> ->
        Vue.component('router-view', {
            render: h => {
                var component = this.routeMap[this.app.crueent].component;
                return h(component)
            }
        })
    }
    //设置当前路径
    onHashChange() {
        this.app.current = window.location.hash.slice(1) || '/'
    }
}


//插件逻辑 
// 把VueRouter变为插件
//Vue.use(xx) Vue 的每个插件都有一个install方法 接受一个Vue实例
VueRouter.install = function (_Vue) {
    Vue = _Vue; //这里保存 上面使用
    // mixin 混入：对Vue进行扩展
    Vue.mixin({
        beforeCreate() {
            // 这里的代码会在外面 初始化的时候被调用，这样就实现了Vue扩展
            if (this.$options.router) { // 只希望根组件执行一次
                // 确保是根组件时执行一次，将router实例放到vue原型上，
                // 以后所有组件实例，均可有$router
                // this 是 Vue组建的实例
                Vue.prototype.$router = this.$opions.router;
                this.$options.router.init();
            }
        }
    })
}
```

> 分析一下需要完成的任务：
>
> 1. 要能解析routes配置，变成一个key为path，value为component的map
> 2. 要能监控url的变化事件，把最新的hash值保存到current路由中
> 3. 要定义两个全局组件：router-view用于显示匹配组件内容，router-link用于修改hash
> 4. curren应该是响应式的，这样可以出发router-view的重新渲染

#### 具体实现

```js
// kvue-router
let Vue;

class VueRouter{
    constructor(options){
        this.$options = options;
        this.routeMap = {};
        // 创建一个路由path 和route的映射
        this.app = new Vue({
            // 利用vue的双向数据原理，绑定一个当前的url，默认是 /
            //将来当前的路径current需要响应式，利用vue的响应式可以做的这一点
 			data:{
                current: '/'
            }
        })
    }
    // 绑定事件
    init(){
        // 绑定浏览器事件
		this.bindEvents();
        //解析路由配置
        this.createRouteMap(this.$options);
        // 初始化router-link和router-link组件
        this.initComponent();
    }
    bindEvents(){
        // 页面刷新 和 url路径变化时触发事件
 		window.addEventListener('load', this.onHashChange.bind(this), false);
        window.addEventListener('hashchange', this.oonHashChange.bind(this), false)
    }
    //路由映射表
    createRouterMap(options){
        options.routes.forEach(item=>{
			this.routeMap[item.path] = item;
            //this.routeMap.'/' = {path: '/', component: Home},
        })
    }
    // 初始化<router-link>和<route-view>组件
    initComponent(){
        // 声明两个全局组件
        Vue.component('router-link',{
            props:{
                to: String
            },
            render(h){
             // return <a href={this.to}>{this.$slots.default}</a>
             return h('a', {
                 attrs:{
                     href: '#'+this.to
                 }
             },[
                 this.$slots.default
             ])   
            }
        })
        Vue.component('router-view', {
          render: h=>{
				var component = this.routeMap[this.app.crueent].component;
              reutrn h(component)
          }  
        })
    }
    //设置当前路径
    onHashChange(){
		this.app.current = window.location.hash.slice(1) || '/'
    }
}


//插件逻辑 
// 把VueRouter变为插件
//Vue.use(xx) Vue 的每个插件都有一个install方法 接受一个Vue实例
VueRouter.install = function(_Vue){
    Vue = _Vue;//这里保存 上面使用
    // mixin 混入：对Vue进行扩展
    Vue.mixin({
        beforeCreate(){
            // 这里的代码会在外面 初始化的时候被调用，这样就实现了Vue扩展
            if(this.$options.router){// 只希望根组件执行一次
                // 确保是根组件时执行一次，将router实例放到vue原型上，
                // 以后所有组件实例，均可有$router
                // this 是 Vue组建的实例
               Vue.prototype.$router = this.$opions.router;
               this.$options.router.init();
            }
        }
    })
}
```

> 测试注意：
>
> 不要出现router-view嵌套，因为没有考录，把Home中的router-view先禁用，导航链接修改为hash

**只要把逻辑（思路）理顺了，实现的方法有多种**