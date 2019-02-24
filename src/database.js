const mongoose = require('mongoose');

mongoose.connect('mongodb://test0:dVxdMyx1HmhxM1sH@cluster0-shard-00-00-ojqdw.mongodb.net:27017,cluster0-shard-00-01-ojqdw.mongodb.net:27017,cluster0-shard-00-02-ojqdw.mongodb.net:27017/ATM_db?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
    .then(db =>console.log('DB is connected'))
    .catch(err =>console.error(err));