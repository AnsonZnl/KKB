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