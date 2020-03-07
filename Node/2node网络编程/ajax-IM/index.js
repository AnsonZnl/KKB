const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.use(bodyParser.json())
let list = ['你好','Hello'];
app.get('/',(req, res)=>{
    res.sendFile(path.resolve('./index.html'))
    
})
app.get('/list',(req, res)=>{
    res.send(JSON.stringify(list))
})
app.post('/send',(req, res)=>{
    list.push(req.body.mes);
    res.send(JSON.stringify(list))
})
app.post('./clear',(req,res)=>{
    list.length = 0;
    res.send(JSON.stringify(list))
})
app.listen(3000)