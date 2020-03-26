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
            // asyncAdd() {
            //    this.$store.dispatch('asyncAdd').then(res=>{
            //        if(res.code == 200){
            //            alert(res.mes)
            //        }
            //    })
            // },
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

<style lang="scss" scoped>

</style>