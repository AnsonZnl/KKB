<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App" ref="hw">
      <template v-slot:content>我是插槽的内容</template>
    </HelloWorld>
    <button @click="showAlert">我是弹框</button>
    <ul>
      <Tree :model="treeData"></Tree>
    </ul>
  </div>
</template>

<script>
  import HelloWorld from './components/HelloWorld.vue'
  import Notice from "./components/Notice/index.vue"
  import Create from "./utils/create"
  import Tree from './components/tree/index';
  export default {
    name: 'App',
    components: {
      HelloWorld,
      Tree
    },
    provide() {
      return {
        ptext: '我是祖先组件的111值'
      }
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
    mounted() {
      this.$refs.hw.foo = '123';
      console.log(this.$children);
      this.$children[0].foo = '456'
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

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>