## vue.js项目中的一些最佳实践
**学习目标**
- 项目配置
- 项目结构
- 权限控制
- 数据交互
- UI库：mobile & pc
- 测试

### 项目配置
- 老项目`npm run eject // 项目打散，弹出来`
- vue.confin.js
- [vue.config.js文档](https://cli.vuejs.org/zh/config/#vue-config-js)
``` js
const prot = 7070;
const title = 'Vue 最佳实践';
module.exports = {
    devServer:{
        prot
    },
    configureWebpack:{
        name: title
    }
}
```