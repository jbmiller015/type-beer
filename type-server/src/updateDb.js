require('./models/Beer');
const mongoose = require('mongoose');

mongoose.connect(db_string, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance')
});

mongoose.connection.on('error', (err) => {
    console.log('Connection error: ' + err);
});


const Object = mongoose.model('Beer');


Object.schema.

