const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const app = express();
const password = process.env.MONGO_PASSWORD;

const erase = require('./routes/erase.js');
const weather = require('./routes/weather.js');


// Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = `mongodb+srv://p1_user:${password}@p1-4jwuj.mongodb.net/p1?retryWrites=true&w=majority`;
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/weather', weather);
app.use('/erase', erase);

let port = 3000;
app.listen(port, () => {
  console.log('Server is up and running on port ' + port);
});
