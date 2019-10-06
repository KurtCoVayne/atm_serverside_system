const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://nodeApplications:zT8GkAlf9kqkuPkc@cluster0-ojqdw.mongodb.net/test?retryWrites=true&w=majority", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
    .then(db =>console.log('DB is connected'))
    .catch(err =>console.error(err));
