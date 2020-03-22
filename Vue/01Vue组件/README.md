## 课程目标
- 深入理解Vue的组件化机制，掌握Vue的组件化常用技术
- 能够设计并实现多种类型的组件 
- 通过组价化实践 加深对Vue原理的理解

## 知识要点
- 组件通信技术
- 组件复合技术
- 递归组件
- 表单组件实现
- Alert组件实现
- Tree组件实现

## 启动一个 Vue Project
``` bash
cnpm install -g @vue/cli
cnpm install -g @vue
vue create vue-study
cd vue-study
npm run serve
open browser http://localhost:8080
```
- [Create Vue Project](https://cli.vuejs.org/zh/guide/creating-a-project.html)

## 资源
- [Vue.js2.6](https://cn.vuejs.org/)
- [vue-cli](https://cli.vuejs.org/zh/)

## 组件化
> 组件化思想是Vue的核心思想，主要的目的是代码的复用.

### 组件通信
#### 父组件=>子组件
- 属性props
``` js
//child
props: {mes: String}

//parent
<HelloWorld mes="Welcome to Your Vue.js App"/>
```
- 引用refs
``` javascript
//parent 
<HelloWorld ref='hw'/>
//挂载之后才能取值 （父组件先去子组件创建）
monuted(){
  this.$refs.hw.foo = 'foo'
}
//child HelloWorld
  data() {
    return {
      foo: "xxx"
    }
  },
```
- 子元素children（子组件不保证顺序）
``` js
// parent
this.$children[0].xx = '222'
// child
data(){
    return {
        xx: '111'
    }
}
```

#### 子组件=>父组件：自定义事件
- 自定义事件（观察者模式）
```js
// child
this.$emit('add', good)
// parent
<Cart @add="cartAdd($event)"></Cart>
```

#### 兄弟组件：通过共同祖辈组件
- 通过共同的祖辈组件搭桥，$parent或$root
``` js
// borther1
this.$parent.$on('foo', handle)
// borther2
this.$parent.$emit('foo')
```

#### 祖先和后代之间

由于嵌套层数过多，传递props不切实际，vue提供了provide/injectAPI完成该任务

- provide/ inject：能够实现祖先给后代传值

  ```js
  // ancestor 
    provide(){
      return {foo: 'foo text'}
    }
  // descendant
inject:['foo']
  // html
  {{foo}} => 'foo text'
  ```
  

>  注意：`provide`和`inject`主要为高阶插件/组件库提供用例，**并不推荐直接用于应用** ，多会在开源组件库中见到。
>
> 但是，反过来想要后代给祖先传值这种方案就不行了。
>
> `inject`的值不能修改，如果要修改，可以`inject`一个可以改动这个值得函数进来，子组件直接调用函数修改。

#### 任意两个组件之间：事件总线 或 vuex

- 事件总线：创建一个Bus类负责派发、监听和回调管理

  ```js
  // Bus：事件派发、监听和回调管理（观察者模式）
  class Bus{
      constructor（）{
              //{
              // eventName1: [fn1. fn2]
              // eventName2: [fn3. fn4]
              //}
              this.callbacks = {}
      }
      $on(naem, fn){
          this.callbacks[name] = this.callbacks[name] || []
          this.callbacks[name].push(fn)
      }
      $emit(name, args){
          if(this.callbacks[name]){
              this.callbacks[name].forEach(cb=>cb(args))
          }
      }
  }
  //main.js
  Vue.prototype.$bus = new Bus()
  //child1
  this.$bus.$on('foo', handle)
  //child2
  this.$bus.$emit('foo')
  ```

  > 实践中可以用Vue代替Bus，因为他已经实现了响应功能。

  - vuex ： 创建唯一的全局数据管理store，通过它管理数据并通知组件状态变更。

组件通信范例代码请参考：components、communicate

## 插槽

插槽语法是Vue中实现的内容分发API，用于复合组件开发。该技术在通用组件库开发中有大量应用。

> Vue 2.6.0之后采用全新v-slot语法取代之前的slot、slot-scope

### 匿名插槽

```html
// child com
<div>
    <slot></slot>
</div>

// parent
<comp>hello</comp>
```

### 具名插槽

将内容分发到子组件的指定位置

```html
// Comp2 
<div>
    <slot></slot>
    <slot name="content"></slot>
</div>

// parent
<Comp2>
  <!--默认插槽用default做参数 -->
    <template v-slot:default>具名插槽default</template>
  <!-- 具名插槽用插槽名做参数 -->
    <template v-slot:content>内容....</template>
</Comp2>
```

> can only appear at the root level inside the receiving component
>
> 只能出现在接受组件的根级别

### 作用域插槽

分发内容要用到子组件的数据

```html
// comp 具名插槽下使用
<div>
    <slot name="content" foo="foo" bar="bar"></slot>
</div>

// parent
<Comp3>
   <!-- 把v-slot的值指定为作用域上下文对象 -->
    <template v-slot:content="slotProps">
      来自子组件数据：{{slotProps.foo}}
      来自子组件数据：{{slotProps.bar}}
    </template>
</Comp3>
```

**范例**

插槽相关范例请参考components/slots中代码

## 编写公共组件

- 实现一个类似ElementUI  for Form的组件 
- 实现一个弹窗组件
- 实现一个递归组件（树形组件）

### Form、FormItem、Input

- 参照ElementUI的Form组件实现，主要是组件间的传值和验证。
- 主要涉及到的值父子组件传值、隔代传值和验证。学到了实现，并没有实践。

### 弹窗组件

> 弹窗这类组件的特点它们在当前的vue实例之外独立存在的，是全局可用的，通常挂载于body，他们是通过 JS 动态创建的，需要在任何组件中声明。

- /components/Notice/index.vue

```vue
<template>
    <div v-if="isShow" id="mes">
        <h3>{{title}}</h3>
        <p>{{message}}</p>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: ""
            },
            message: {
                type: String,
                default: ""
            },
            duration:{
                type: Number,
                default: 2000
            }
        },
        data() {
            return {
                isShow: false
            }
        },
        methods: {
            show() {
                console.log('show')
                this.isShow = true;
                setTimeout(()=>{
                    this.hide()
                }, this.duration)
            },
            hide() {
               this.isShow = false;
               this.remove()
            }
        }
    }
</script>
```

- /src/utils/create.js

  > create函数用于动态创建指定组件实例并挂载至body

```js
// 创建指定组件实例并挂载与body上
import Vue from "vue";

export default function create(Component, props){
    //0. 创建vue 实例
    const vm = new Vue({
        render(h){
            // render 方法提供给我们一个h函数，他可以渲染VNode（虚拟DOM）
            return h(Component, {props})
        }
    }).$mount();
    //挂载操作，可以直接$mount("#app")挂载到#app上，可以先不填，在未来填写。 
    //$mount 参考：https://cn.vuejs.org/v2/api/#vm-mount
    //1. 上面的vm帮我们 创建了组件实例
    //2. 通过$children获得该组件的实例
    // console.log(vm.$root)
    const comp = vm.$children[0];
    // 3. 追加至body
    document.body.appendChild(vm.$el);
    // 4. 清理函数
    comp.remove = ()=>{
        document.body.removeChild(vm.$el);
        vm.$destroy();
    }
    // 5. 返回组件实例
    return comp;
}
```

- src/app.vue

```vue
<template>
  <div id="app">
    <button @click="showAlert">弹框</button>
  </div>
</template>

<script>
  import HelloWorld from './components/HelloWorld.vue'
  import Notice from "./components/Notice/index.vue"
  import Create from "./utils/create"
  export default {
    name: 'App',
    components: {
      HelloWorld
    },
    methods: {
      showAlert() {
        console.log('alert')
        const notice = Create(Notice, {
          title: "我是弹窗",
          message: '我是弹窗我是弹窗我是弹窗我是弹窗我是弹窗',
          duration: 2000
        })
        notice.show();
        console.log(notice)
      }
    }

  }
</script>
```

### 递归组件（Tree）

> 递归组件是可以在他们自己模板中调用自身的组件

```vue
// Node.vue
<template>
 <div>
 <h3>{{data.title}}</h3>
 <!-- 必须有结束条件 -->
 <Node v-for="d in data.children" :key="d.id" :data="d"></Node>
 </div>
</template> <script>
export default {
 name: 'Node', // name对递归组件是必要的
 props: {
     data: {
             type: Object,
             require: true
         },
     },
 }
</script>
// 使⽤
<Node :data="{id:'1',title:'递归组件',children:[{...}]}"></Node>
```

#### 实现Tree组件

Tree组件是典型的递归组件，其他的诸如菜单组件都属于这一类，也是相当常见的。

**组件设计**

Tree组件最适合的结构是无序列表ul，创建一个递归组件Item表示Tree选项，如果当前Item存在children，则递归渲染子树，以此类推，同时添加一个标识管理当前村级item的展开状态。

- components/Tree/index.vue

```vue
<template>
    <li>
        <div @click="toggle">
            {{model.title}}
            <span v-if="isFolder">[{{open ? '-' : '+'}}]</span>
        </div>
        <ul v-show="open" v-if="isFolder">
            <item class="item" v-for="model in model.children" :model="model" :key="model.title"></item>
        </ul>
    </li>
</template>
<script>
    export default {
        name: "Tree",
        props: {
            model: Object
        },
        data: function () {
            return {
                open: false
            };
        },
        computed: {
            isFolder: function () {
                return this.model.children && this.model.children.length;
            }
        },
        methods: {
            toggle: function () {
                if (this.isFolder) {
                    this.open = !this.open;
                }
            },
        }
    };
</script>
```

- scr/app.vue

```
<template>
  <div id="app">
    <ul>
      <Tree :model="treeData"></Tree>
    </ul>
  </div>
</template>

<script>
  import Tree from './components/tree/item';
  export default {
    name: 'App',
    components: {
      Tree
    },
    data() {
      return {
        treeData: {
          title: "Web全栈架构师",
          children: [{
              title: "Java架构师"
            },
            {
              title: "JS⾼级",
              children: [{
                  title: "ES6"
                },
                {
                  title: "动效"
                }
              ]
            },
            {
              title: "Web全栈",
              children: [{
                  title: "Vue训练营",
                  expand: true,
                  children: [{
                      title: "组件化"
                    },
                    {
                      title: "源码"
                    },
                    {
                      title: "docker部署"
                    }
                  ]
                },
                {
                  title: "React",
                  children: [{
                      title: "JSX"
                    },
                    {
                      title: "虚拟DOM"
                    }
                  ]
                },
                {
                  title: "Node"
                }
              ]
            }
          ]
        }
      }
    },
  }
</script>
```

