# Vue
- [Vue 官方文档](https://cn.vuejs.org/)
- [Vue 老师课件源码[github]](https://github.com/57code)
## 学习方法
- 听明白在动手，注重听原理和理清逻辑
- 一定要动手敲，遇到问题先思考在百度
- 实践是唯一的检验方式
- 尝试自己解决问题
- 学会一种学习方式比学会更好。授人以鱼不如授人以渔
- 具体情况具体分析

## 课程体系
- Vue组件化实践
- Vue全家桶 & 原理
- 手写Vue源码
- Vue 源码波西
- Vue 项目实践
- 服务端渲染SSR
- TS及Vue应用

## 笔记
  - [vue 组件化](https://github.com/AnsonZnl/KKB/tree/master/Vue/01Vue%E7%BB%84%E4%BB%B6)
  - [vue-router](https://github.com/AnsonZnl/KKB/tree/master/Vue/02vue-router)
  - [vuex](https://github.com/AnsonZnl/KKB/tree/master/Vue/03vuex)
  - [vue-源码解析01](https://github.com/AnsonZnl/KKB/tree/master/Vue/04%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%901)

## render函数
- [render](https://cn.vuejs.org/v2/guide/render-function.html)函数
- 渲染节点
- render 使用h函数，可以渲染节点，（最接近底层的写法）
- 在浏览器环境可以使用template模板字符串
- 如果配置了jsx也可以写jsx返回
```js
    // <div id="box" class="foo"><span>aaa</span></div>
    Vue.component('comp', {
        // template: '<div id="box" class="foo"><span>aaa</span></div>',
        // render(){reutrn <div id="box" class="foo"><span>aaa</span></div>}
        render(h) {
            return h('div', {
                class: {
                    foo: true
                },
                attrs: {
                    id: 'box'
                }
            }, [h('span', 'aaa')])
        }
    })
```

## 快捷键
- vbase-快速创建vue组件模板
- vdata-
- vmethods- 
