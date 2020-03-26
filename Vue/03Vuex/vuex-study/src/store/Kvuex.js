let Vue;

function install(_Vue) {
    Vue = _Vue;
    // 这样store执行的时候，就有了Vue 不用import Vue了
    // 这也就是为啥Vue.use 必须在创建store之前
    Vue.mixin({
        beforeCreate() {
            // 这样才能获取到传递进来的store
            // 只有root元素才有store ,所以判断一下
            if (this.$options.store) {
                Vue.prototype.$store = this.$options.store;
            }
        }
    })
}

class store {
    constructor(options = {}) {
        this.state = new Vue({
            data: options.state
            //利用Vue 的数据响应式 
        });
        // 初始化
        this.mutations = options.mutations || {}
        this.actions = options.actions || {}

        options.getters && this.handleGetters(options.getters)
    }
    // commit 使用箭头函数形式（this指向问题） 后面actions实现时会有作用
    // 触发mutations 实现commit
    commit = (type, arg) => {
        // this 指向Store 实例
        const fn = this.mutations[type];
        fn(this.state, arg)
    }
    // 触发actions
    dispatch = (type, arg) => {
        const fn = this.actions[type];
        return fn({
            commit: this.commit,
            state: this.state
        }), arg
    }
    // 用户传过来的 {getters:{score(state){ return state.xx }}}
    handleGetters(getters) {
        this.getters = {}; //store 实例上的getters
        // 定义只读的属性
        Object.keys(getters).forEach(key => {
            // 把用户传过来的属性 都定义为store上只读的属性
            Object.defineProperty(this.getters, key, {
                get: () => { //箭头函数
                    return getters[key](this.state)
                }
            })
        })
    }

}

export default {
    Store,
    install
}