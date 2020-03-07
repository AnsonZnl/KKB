// const express = require('express');
const express = require('./mini-express.js');
const app = express();
app.get('/', (req, res)=>{
    res.end('Hello Express!')
})
app.get('/users', (req, res)=>{
    res.end(JSON.stringify({name: 'znl'}))
})
app.listen(3000,()=>{
    console.log('code run of http://localhost:3000/')
})