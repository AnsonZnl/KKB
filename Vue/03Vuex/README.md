## Vuex 
> Vuex是一个专为Vue.js应用开发的**状态管理模式**，集中式储存管理应用所有组件的状态。
Vuex遵循“单向数据流”理解，易于问题追踪以及提高代码可维护性。
Vuex中多个视图依赖于同一状态时，视图间传参和状态同步比较困难，Vuex能够很好的解决该问题。

## 安装
```
vue cerate vuex-study
cd vuex-study
vue add vuex router
npm run serve
open browser http://localhost:8080/
```

## 核心概念

#### 核心概念

- state状态、数据
- mutations 更改状态的函数
- actions 异步操作
- store 包含以上概念的容器

#### 状态和状态变更

state保存数据状态，mutations用于修改状态；

> 组件中修改Vuex中的状态，必须通过`this.$store.commit('methodName')`来提交变更，最终由`mutations`来决定变更。

stote/index.js

```js
export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    add(state, num=2){
      state.count += num;
    }
  }
})

```

VuexTest.vue

```vue
<template>
    <div>
        <h2>Vuex Test</h2>
        <p>{{$store.state.count}}</p>
        <button @click="add">add</button>
    </div>
</template>

<script>
    export default {
        methods: {
            add() {
               this.$store.commit('add', 2)
            }
        },
    }
</script>
```

#### 派生状态- getters

从state派生出新状态，类似计算属性;

store/index.js

```js

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    add(state, num = 1){
      state.count += num;
    }
  },
  getters:{
    score(state){
      return `一共点击了 ${state.count / 2} 次`
    }
  }
})

```

VuexTest.vue

```vue
<template>
    <div>
        <h2>Vuex Test</h2>
        <p>{{$store.state.count}}</p>
        <p>{{$store.getters.score}}</p>
        <button @click="add">add</button>
    </div>
</template>

<script>
    export default {
        methods: {
            add() {
               this.$store.commit('add', 2)
            }
        },
    }
</script>
```

#### 动作 - actions

负责业务逻辑，类似controller，（比如ajax请求）

> actions 的方法 必须使用 dispatch 触发
>
> actions 适用于复杂逻辑操作，可以改变多个state的状态，执行多个commit即可。
>
> mutations很纯粹，只接受commit然后改变状态。

store/index.js

```js
export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    add(state, num = 1){
      state.count += num;
    }
  },
  actions: {
    asyncAdd({commit}){
      return new Promise(resolve=>{
        setTimeout(()=>{
          commit('add', 10);
          resolve({code: 200, mes: '成功'})
        }, 2000)
      })
    }
  },
})

```

VuexTest.vue

```html
<template>
    <div>
        <h2>Vuex Test</h2>
        <p>{{$store.state.count}}</p>
        <p>{{$store.getters.score}}</p>
        <button @click="add">add</button>
        <button @click="asyncAdd">asyncAdd</button>
    </div>
</template>

<script>
    export default {
        methods: {
            add() {
               this.$store.commit('add', 2)
            },
            // promise then 接收
            asyncAdd() {
               this.$store.dispatch('asyncAdd').then(res=>{
                   if(res.code == 200){
                       alert(res.mes)
                   }
               })
            },
            // async await 接收
            async asyncAdd(){
                let res = await this.$store.dispatch('asyncAdd');
                if(res.code == 200){
                    alert(res.mes)
                }
            }
        },
    }
</script>

```

####  模块化

- 把一些状态集中放在一个js中，统一管理
- [Vuex state models](https://vuex.vuejs.org/zh/guide/modules.html)

#### Vuex源码解析

1. 维护状态 state
2. 修改状态命令 commit
3. 修改状态函数mutations
4. 业务逻辑控制 dispatch
5. 状态派发 getter
6. 实现state响应式
7. 实现插件（fun 的  install）
8. 混入

初始化，Store声明，install实现，Kvuex.js:

```js
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
```

### 作业

- 复习消化前两节的内容
- 了解vue原理，为下节做准备
- 简版Vue：数据响应式、编译器、Object.defineProperty