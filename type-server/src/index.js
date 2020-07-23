require('dotenv').config();
require('./models/User');
require('./models/Beer');
const express = require('express');
const db_string = process.env.CLOUD_STRING;
const authRoutes = require('./routes/authRoutes');
const beerRoutes = require('./routes/beerRoutes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Use for authorized routes
const requireAuth = require('./middlewares/requireAuth');

const app = express();
app.use(bodyParser.json());
app.use(authRoutes);
app.use(beerRoutes);

mongoose.connect(db_string, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance')
});

mongoose.connection.on('error', (err) => {
    console.log('Connection error' + err);
});

//Once Auth is required.
app.get('/', requireAuth, (req, res) => {
    res.send('base');
});

// app.get('/', (req, res)=>{
//     res.send('Type-Beer base');
// });

app.listen(3000, () => {
    console.log('Listening on Port 3000');
})