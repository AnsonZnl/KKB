const redisStore = require('koa-redis');
const redis = require('redis');
const client = redis.createClient(6379, "localhost")
app.use(session({
    key: 'kkb:sess',
    store: redisStore({client})
},app)
)