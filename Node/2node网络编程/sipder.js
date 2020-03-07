const boss_url = 'https://www.zhipin.com/c101010100-p100999/?ka=search_100999';//boss 防止爬
const lagou = 'https://www.lagou.com/zhaopin/webqianduan/?labelWords=label';//拉钩 可爬
const cheerio = require('cheerio');
const axios = require('axios');
axios.get(lagou).then(res=>{
    // console.log(res.data)
    const $ = cheerio.load(res.data);
    console.log($('title').text())
    console.log($('.money').text())
}).catch(err=>{
    console.log(err)
})