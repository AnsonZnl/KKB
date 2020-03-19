const KKB = require("./KKB");
const app = new KKB();
app.use((req, res)=>{
    res.writeHead(200);
    res.end('Hello KKB')
})
app.listen(3000, ()=>{
    console.log('server running at http://localhost:3000')
})