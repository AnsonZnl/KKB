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