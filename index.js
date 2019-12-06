const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const Service = require('./service');
const pg = require("pg");
const Pool = pg.Pool;

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/workshop';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

const service = Service(pool);

const app = express();

app.use(session({
    secret: 'keyboard cat5 run all 0v3r',
    resave: false,
    saveUninitialized: true
}));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post('/api/save/favourite', async (req, res) => {
    try {
        let record = req.body;
        await service.saveFavourite(record);
        res.json({
            status: 'success',
            response: 'successfully saved to favourites'
        })
    } catch (error) {
        res.json({
            status: 'failed',
            error: error.stack
        })
    }
});

app.get('/api/fetch/favourites/:username', async (req, res) => {
    try {
        res.json({
            status: 'success',
            response: await service.listFavourites(req.params.username)
        });
    } catch (error) {
        res.json({
            status: 'failed',
            error: error.stack
        })
    }
});

app.post('/api/remove/favourite', async (req, res) => {
    try {
        let details = req.body;
        let newList = await service.removeFavourite(details.reg, details.user)
        res.json({
            status: 'success',
            response: newList
        });
    } catch (error) {
        res.json({
            status: 'failed',
            error: error.stack
        })
    }
});

const PORT = process.env.PORT || 3010;

app.listen(PORT, function () {
    console.log('started on: ', this.address().port);
});
