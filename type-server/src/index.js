require('dotenv').config();
require('./models/User');
require('./models/Beer');
require('./models/Brewery');
require('./models/Tank');
require('./models/Process');
require('./models/AccessKey');
require('./models/Admins');
require('./models/Event');

const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const db_string = process.env.CLOUD_STRING;
const authRoutes = require('./routes/authRoutes');
const routeHandler = require('./routes/routeHandler');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Use for authorized routes
const requireAuth = require('./middlewares/requireAuth');

//Switch for dev vs prod
//app.use(cors({origin: ['https://typebeer.com'], credentials: true}));
app.use(cors({origin: ['http://localhost:3006'], credentials: true}));

app.use(bodyParser.json({limit: '60mb'}));
app.use(express.urlencoded({extended: true, limit: '60mb'}));
app.use(authRoutes);
app.use(routeHandler);


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

//Auth is required
app.get('/', requireAuth, (req, res) => {
    res.send('base');
});

/**
 app.get('/', (req, res) => {
    res.send('base');
});
 */

const port = process.env.PORT || '8080';

/*https.createServer({
    key: fs.readFileSync(__dirname + '/server.key'),
    cert: fs.readFileSync(__dirname + '/server.cert')
}, app).listen(port, () => {
    console.log('Securely Listening on Port 8080')
})*/

app.listen(port, () => {
    console.log('Listening on Port 8080')
})
