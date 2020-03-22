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
<style scoped>
#mes{
    width: 200px;
    padding: 20px 50px;
    height: 100px;
    position: fixed;
    top: 100px;
    left: 50%;
    margin-left: -150px;
    background: gold;
    color: green;
}
#mes h3{
    text-align: center;
}
</style>