## Vue 源码解析
### 课堂目标
- 深入理解Vue底层原理
- 手写vue核心部分实现

### 知识要点
- vue工作机制
- Vue响应式原理
- 依赖收集与追踪
- 编译 compile

### 为什么要懂原理
编程世界和武侠世界比较像，你看，每一个入门的程序员，都幻想自己有朝一日，神功大成，青衣长剑，救民于水火，但其实大部分人一开始的学习方式就错了，导致一直无法进入到高手的行列，究其原因，就是过于看重招式、武器而忽略了内功的修炼，所以任你慕容复有琅琊玉洞的百家武学，还是被我乔峰一招制敌，这就是内功差距。
**武学之道，切勿贪多嚼不烂，博而不精不如一招鲜吃遍天，编程亦是如此，源码，就是内力修炼的捷径。**

### Vue工作机制
![Vue 工作机制](https://github.com/AnsonZnl/PictureBed/blob/master/fe/vue%E5%B7%A5%E4%BD%9C%E6%9C%BA%E5%88%B601.png?raw=true)
#### 初始化
在new Vue()之后，Vue会调用_init进行初始化，会初始化生命周期、事件、props、methods、data、computed和watch等，其中最重要的是通过Object.defineProperty设置setter和getter，用来实现[**响应式**]和[**依赖收集**]。
初始化之后调用$mount挂载组件,主要执行编译和首次更新。

#### 编译
编译模式分为三个阶段
1. parse：使用正则解析template中的vue的指令（v-xx）变量等等，形成抽象语法树AST。
2. optimize：标记一些静态节点，用作后面的性能优化，在diff的时候直接略过。
3. generate：把第一部生成的AST转化为渲染函数 Render Function

#### 响应式
这一块是Vue最核心的内容，初始化的时候通过defineProperty定义对象getter、setter，设置通知机制当编译生成的渲染函数被实际渲染的时候，会触发getter进行依赖收集，在数据变化的时候，触发setter进行更新。

#### 虚拟DOM
> 虚拟DOM就是一个JS对象，来描述真实DOM结构。

Virtual DOM 是react首创，Vue2开始支持，就是JavaScript对象来描述DOM结构，数据修改的时候，我们先修改虚拟DOM中的数据，然后数组做diff，最后在汇总所有的diff，力求最少的DOM操作，毕竟js里对比很快（得益于V8），而真实的DOM操作太慢了。

**虚拟DOM可以通过diff算法，减少DOM操作或者把多次的DOM操作优化到最一次。**
``` js
// vdom
{
    tag: 'div',
    props:{
        id: 'box',
        style: {color: red},
        onClick: 'handle'
    },
    children:[
        {
            tag: 'a',
            text: 'click me'
        }
    ]
}
// html
<div id="box" style="color:red; @click="handle">
      <a>click me</a>
</div>
```

#### 更新视图
数据修改触发setter，然后监控器会通知进行修改，通过对比新旧vdom树，得到最小修改，就是`patch`，然后只需要把这些差距修改即可。

### 实现简版Vue
<img src="https://github.com/AnsonZnl/PictureBed/blob/master/fe/vue%E5%B7%A5%E4%BD%9C%E6%9C%BA%E5%88%B602.png?raw=true" alt="简版Vue底层关系图" style="zoom:67%;" />

#### 基于Object.defineProperty 的数据劫持

```html

<body>
    <div id="app"></div>
    <script>
        let obj = {
            name: 'jerry',
            _name: 'jerry',
        };
        let app = document.getElementById('app');
        app.innerHTML = `我叫${obj.name}`
        Object.defineProperty(obj, 'name', {
            get: function () {
                console.log('读取name：' + this._name);
                return this._name;
            },
            set: function (val) {
                this._name = val;
                app.innerHTML = `我叫${this.name}，今年${this.age}`;
                console.log('设置name：' + val);
            }
        })
    </script>
</body>
```

参考文章：

- [MDN-Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

- [Object.defineProperty 栈溢出](https://blog.csdn.net/qq_20312383/article/details/81395956)



#### 劫持监听所有的属性 

```js
class ZVue {
    constructor(options) {
        // 保留选项 {el: '#app', data: {..}, props: {...}}
        this.$options = options;

        // 传入data
        this.$data = options.data;

        // 响应化处理 遍历对象 做数据劫持 递归操作
        this.observe(this.$data);
    }
    observe(data) {
        if (!data || typeof data !== "object") {
            return;
        }
        // 遍历data 对每一个key 做数据劫持
        Object.keys(data).forEach(key => {
            // 把每个对象都设置getter setter
            this.defineReactive(data, key, data[key]);
            // 把app.data的数据代理到app上
            this.proxyData(key)
            console.log(data, key, data[key])
        });
    }
    // 把每个对象都设置getter setter
    defineReactive(obj, key, val) {
        // 如果是对象 就递归
        this.observe(val)
        Object.defineProperty(obj, key, {
            get() {
                return val;
            },
            set(newVal) {
                if (newVal !== val) {
                    val = newVal;
                    console.log(key + '发生了变化');
                }
            }
        })
    }
    // 代理 data
    proxyData(key) {

        // this 指向Vue的实例 （把所有的属性都代理到app上）
        Object.defineProperty(this, key, {
            get() {
                return this.$data[key]
            },
            set(newVal) {
                this.$data[key] = newVal;
            }
        })
    }
}
```



#### 依赖收集与追踪（解析指令）

看下面的案例，理出思路。

```js
new Vue({
    template:
    `<div>
		<span>{{name1}}</span>
		<span>{{name2}}</span>
		<span>{{name1}}</span>
    </div>`,
    data:{
        name1: 'name1',
        name2: 'name2',
        name3: 'name3',
    },
    created(){
        this.name1 = '开课吧'
        this.name3 = 'Jerry'
    }
})
```

>name1 被修改，视图更新，切要更新两处。
>
>name2被修改，视图更新，
>
>name3没用到，不需要更新，
>
>如果实现呢，需要扫描视图，收集依赖，知道视图中到底哪些地方对数据有依赖，这样当数据变化时就可以进一步操作了。

#### 实现Dep 和 Watcher类

![](https://github.com/AnsonZnl/PictureBed/blob/master/fe/watcher%E5%AF%B9%E5%BA%94%E5%85%B3%E7%B3%BB.png?raw=true)

### 编译

核心任务

1. 获取并遍历DOM树
2. 文本节点：获取{{}}格式的内容并解析
3. 元素节点：访问节点特性，截获k-和@开头的内解析

![](https://github.com/AnsonZnl/PictureBed/blob/master/fe/%E7%BC%96%E8%AF%91%E8%BF%87%E7%A8%8B%E5%9B%BE.png?raw=true)

talk is cheap show me the *money* code（话不多说，代码拿来）

```js
// 扫描模板中所有依赖创建更新函数和watcher
class Compile {
    // el是宿主元素或其选择器
    // vm当前Vue实例
    constructor(el, vm) {
      this.$vm = vm;
      this.$el = document.querySelector(el); // 默认选择器
  
      if (this.$el) {
        // 将dom节点转换为Fragment提高执行效率
        this.$fragment = this.node2Fragment(this.$el);
        // 执行编译
        this.compile(this.$fragment);
        // 将生成的结果追加至宿主元素
        this.$el.appendChild(this.$fragment);
      }
    }
    node2Fragment(el) {
      // 创建一个新的Fragment
      const fragment = document.createDocumentFragment();
      let child;
      // 将原生节点拷贝至fragment
      while ((child = el.firstChild)) {
        // appendChild是移动操作
        fragment.appendChild(child);
      }
      return fragment;
    }
  
    // 编译指定片段
    compile(el) {
      let childNodes = el.childNodes;
      Array.from(childNodes).forEach(node => {
        // 判断node类型，做响应处理
        if (this.isElementNode(node)) {
          // 元素节点要识别k-xx或@xx
          this.compileElement(node);
        } else if (
          this.isTextNode(node) &&
          /\{\{(.*)\}\}/.test(node.textContent)
        ) {
          // 文本节点，只关心{{xx}}格式
          this.compileText(node, RegExp.$1); // RegExp.$1匹配内容
        }
        // 遍历可能存在的子节点
        if (node.childNodes && node.childNodes.length) {
          this.compile(node);
        }
      });
    }
  
    // 编译元素节点
    compileElement(node) {
      // console.log("编译元素节点");
  
      // <div k-text="test" @click="onClick">
      const attrs = node.attributes;
      Array.from(attrs).forEach(attr => {
        // 规定指令 k-text="test" @click="onClick"
        const attrName = attr.name; // 属性名k-text
        const exp = attr.value; // 属性值test
        if (this.isDirective(attrName)) {
          // 指令
          const dir = attrName.substr(2); // text
          this[dir] && this[dir](node, this.$vm, exp);
        } else if (this.isEventDirective(attrName)) {
          // 事件
          const dir = attrName.substr(1); // click
          this.eventHandler(node, this.$vm, exp, dir);
        }
      });
    }
    compileText(node, exp) {
      //
      // console.log("编译文本节点");
      this.text(node, this.$vm, exp);
    }
  
    isElementNode(node) {
      return node.nodeType == 1; //元素节点
    }
  
    isTextNode(node) {
      return node.nodeType == 3; //元素节点
    }
  
    isDirective(attr) {
      return attr.indexOf("k-") == 0;
    }
  
    isEventDirective(dir) {
      return dir.indexOf("@") == 0;
    }
  
    // 文本更新
    text(node, vm, exp) {
      this.update(node, vm, exp, "text");
    }
  
    // 处理html
    html(node, vm, exp) {
      this.update(node, vm, exp, "html");
    }
  
    // 双向绑定
    model(node, vm, exp) {
      this.update(node, vm, exp, "model");
  
      let val = vm.exp;
      // 双绑还要处理视图对模型的更新
      node.addEventListener("input", e => {
        vm[exp] = e.target.value;
        // val = e.target.value;
      });
    }
  
    // 更新
    update(node, vm, exp, dir) {
      let updaterFn = this[dir + "Updater"];
      updaterFn && updaterFn(node, vm[exp]); // 执行更新，get
      new Watcher(vm, exp, function(value) {
        updaterFn && updaterFn(node, value);
      });
    }
  
    textUpdater(node, value) {
      node.textContent = value;
    }
    htmlUpdater(node, value) {
      node.innerHTML = value;
    }
    modelUpdater(node, value) {
      node.value = value;
    }
  
    eventHandler(node, vm, exp, dir) {
        let fn = vm.$options.methods && vm.$options.methods[exp];
        if (dir && fn) {
            node.addEventListener(dir, fn.bind(vm), false);
        }
    }
  }
  
```





### 作业

- k-model
- @click