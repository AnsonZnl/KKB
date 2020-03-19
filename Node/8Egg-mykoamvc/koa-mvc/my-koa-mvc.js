const Koa = require('koa');
const {initRouter} = require('./loader');

class mykoamvc{
    constructor(conf){
        this.$app = new Koa(conf);
        this.$router = initRouter();
        this.$app.use(this.$router.routes())
    }
    start(port){
        this.$app.listen(port, ()=>{
            console.log(`server running at http://localhost:${port}`)
        })
    }
}
module.exports = mykoamvc