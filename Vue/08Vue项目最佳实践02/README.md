## vue.js项目中的一些最佳实践
- 数据交互
  - mock数据
  - 鉴权
- 测试
  - 黑盒测试
  - 白盒测试
  - 单元测试（jest）

### 权限控制
  - 路由权限,异步加载路由，按钮控制权限
  - 按钮显示权限 自定义指令或v-if
  - 导航菜单控制,tree组件，递归
  - 面包屑
### 数据交互
  - mock数据
  - 鉴权(token, session cookie)
  - 数据交互流程：
> api：service => request => local mock&esay-mock&server api

**主要问题分析**
1. 有时候需要对请求头、响应进行统一预处理
2. 请求不同数据时url会变化，需要能根据环境（开发环境和生产环境）自动修改url
3. 可能出现的跨域问题

#### 封装Request
解决前两个问题，需要统一封装请求代码。
安装 axios：`npm i axios -S`
创建：`@/utils/request.js`

#### mock data
- 本地mock
  - 配置vue.config.js的devServer
- 线上mock
  - easy-mock

#### 跨域
- 开发
  - 在vue.config.js配置proxy
  - 或者后端配置 CORS
- 线上
  - Nginx反向代理（和vue.config.js的proxy保持一致）
  - 后端 CORS

#### 测试
测试分类
- 黑盒测试
常见的开发流程里，都有测试人员，他们不管内部实现机制，只看最外层的输入输出。
- E2E测试
比如你写一个加减法的页面，会设计N个用例，测试加减法的正确性，
- 集成测试
更负责的一种测试，就是集合多个测试过的单元一起测试
- 白盒测试
我们针对一些内部核心实现逻辑编写测试代码，称为单元测试。

> 常用的console.log()也算是测试的雏形

**解决方案**
- 单元测试解决方案：Jest
- 端到端测试解决方案：Cypress

##### Jest
文档参考：jest.io
- describe：定义一个测试套件
- it：定义一个测试用例
- expect：断言的判断条件

### Vue test utils
> vue的测试套件。
- 测试覆盖率
- e2e自动化的测试，端到端的测试

**学习vue-element-admin项目**
- [vue-element-admin地址](https://github.com/PanJiaChen/vue-element-admin)