var express = require('express');
var app = express();
var morgan = require('morgan');
var cookieparser = require('cookie-parser');
require('dotenv').config();
var compression = require('compression');
var router = express.Router();
var rootRouter = require('./app/Routes/index')(router);
var cors = require('cors');
var dbConfiguration = require('./app/config/DB');
const _user = require('./app/Model/user');
const ObjectId = require('mongoose').Types.ObjectId;
const bodyParser = require('body-parser');

//cronjb

var cron = require("./app/Service/CronService");
cron.init();

Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}
//middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(compression());
app.use(morgan('dev'));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());
app.use(cors());
app.use('/api', rootRouter);

app.get('/', function (req, res) {
    res.json({ message: "hello world" });
});

app.get('/policy', function (req, res) {
    res.sendFile(__dirname + '/public/views/policy.html')
});

dbConfiguration();

module.exports = app;