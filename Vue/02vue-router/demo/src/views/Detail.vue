<template>
    <div>
        <h3>detail</h3>
        <p>{{id}}</p>
        <div>{{crumbData}}</div>
    </div>
</template>

<script>
    export default {
        props: ['id'],
        // Breadcrumb.vue
        watch: {
            $route: { //route发生变化之后 
                handler() {
                    // [{name: 'home', path: '/' },{name: 'list', path:'/list'}]
                    console.log(this.$route.matched); // 列出 所有嵌套的路由
                    // ['home','list']
                    this.crumbData = this.$route.matched.map(m => m.name || m.redirect)
                },
                immediate: true //一开始就执行
            }
        }
    }
    // // <div id="box" class="foo"><span>aaa</span></div>
    // Vue.component('comp', {
    //     render(h) {
    //         return h('div', {
    //             class: {
    //                 foo: true
    //             },
    //             attrs: {
    //                 id: 'box'
    //             }
    //         }, [h('span', 'aaa')])
    //     }
    // })
</script>

<style lang="scss" scoped>

</style>