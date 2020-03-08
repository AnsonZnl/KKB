(async () => {
    const MBD = require('mongodb').MongoClient;
    const client = await MBD.connect('mongodb://localhost:27017', {
        useNewUrlParser: true
    })
    console.log(client)
})()