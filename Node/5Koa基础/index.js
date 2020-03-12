const Koa = require('koa');
const app = new Koa();
const index = require('./routes/index')
const users = require('./routes/users')

app.use(index.routes())
app.use(users.routes())
app.listen(3000, ()=>{
    console.log('server running http://localhost:3000')
})