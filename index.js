const express = require('express')
const bodyParser = require('body-parser') 
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const path = require('path');
const session = require('express-session')
const methodOverride = require('method-override')
require('dotenv').config()
const systemConfig = require('./config/system');

const app = express()
const port = process.env.PORT;

const database = require('./config/database');
database.connect();

const routeAdmin = require("./routes/admin/index.route");
const routeClient = require("./routes/client/index.route");

app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')
app.use(express.static(`${__dirname}/public`))

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

// Flash
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json  -> chuyển JSON thành JS
app.use(bodyParser.json())

//Khai báo biến toàn cục cho file pug 
app.locals.prefixAdmin = systemConfig.prefixAdmin;

/* TinyMCE */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

//Khai báo đường dẫn
routeAdmin(app);
routeClient(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
