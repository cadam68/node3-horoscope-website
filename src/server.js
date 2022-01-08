
const express = require('express');
const bodyParser = require("body-parser");
const chalk = require('chalk'); 
const pathParse = require('path-parse');
const path = require('path'); 
const yargs = require('yargs')(process.argv.slice(2));
const hbs = require('hbs')

const { appProperties, webProperties } = require('./config/app.config');
const aztorService = require('./services/aztorService');
const CustomError = require('./classes/CustomError');

const app = express();

// === yargs settings ===
yargs.option("port", {
    alias: "p",
    demandOption: false,
    default: appProperties.portDefault,
    describe: "The port were the server is listening",
    type: "number",
    nargs: 1,
    })
.version('1.0.0')
.help()
.usage("Usage: $0 -p port")
.example(`$0 -p ${appProperties.portDefault}`, `: Start the server on port ${appProperties.portDefault}`)
.epilog(`${chalk.bold.inverse.green('Horoscope Server')}\nBy Cyril Adam\nCopyright 2022`);
const argv = yargs.argv;

// -- definition of global settings --
global.__basedir = path.join(__dirname, '..');

// --- set static directory files ---
const publicDirectoryPath = path.join(__basedir, '/public');
app.use(express.static(publicDirectoryPath))                        // Mounts the static files middleware function

// --- configuring express to use body-parser as middle-ware ---
app.use(bodyParser.json());                                         // parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: false }));                // parse requests of content-type - application/x-www-form-urlencoded

// --- set express view engine to Handlebars ---
app.set('view engine', 'hbs');
// --- set the location of the views directory (Handlebars default is /views)
app.set('views', path.join(__basedir, '/templates/views'))
// --- set the location of Handlebars partials
hbs.registerPartials(path.join(__basedir, '/templates/partials'))

// === create the routes ===
// app.com          : root route    // http://localhost:3000/
// app.com/help
// app.com/about
// app.com/forecast

app.get('', (req, res) => {  
    res.render('index', { 
        ...webProperties,
        title: 'Horoscope',
    })
});  

app.get('/about', (req, res) => {
    res.render('about', {
        ...webProperties,
        title: 'About Me', 
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        ...webProperties,
        title: 'Help',
        message: 'Your daily horoscope. Select your sign for your forecast.'
    })
})

// --- api ---
const doForecast = async (query, res) => {
    if(!query.sign) return res.send({ error: 'You must provide an sign!' })
    try {
        // { date_range, current_date, description, compatibility, mood, color, lucky_number, lucky_time }
        const {lucky_number, lucky_time, color, mood, date_range, description} = await aztorService.aztor(query.sign);
        res.send({
            forecast: description,
            sign: `${mood} ${query.sign} (${date_range})... your lucky number is ${lucky_number}, lucky time is ${lucky_time} and color is ${color}.`
        });
    } catch(err) {
        if ((err instanceof CustomError)&&(err.message.includes('wrong sign'))) res.send({ error: 'wrong sign, please use aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius or pisces'});
        else res.send({ error: (err.message)?err.message:err })  
    }
}

app.post('/forecast', async ({body:query}, res) => {  
    console.log(`access by post to 'forecast' page with query=${JSON.stringify(query)}`);
    doForecast(query, res);
})

// --- 404 pages ---
app.get('/help/*', (req, res) => {
    res.render('404', { ...appProperties, title: '404', errorMessage: 'Help article not found' })
})
app.get('*', (req, res) => {
    res.render('404', { ...appProperties, title: '404', errorMessage: 'Page not found' })
})

// === starting the server ===
app.listen(process.env.PORT||argv.port, () => {
    console.log(`${chalk.bold.inverse.green(' Success ')} : Server is up at http://localhost:${process.env.PORT||argv.port}`);
    console.log(`> See more options : ${pathParse(argv['$0']).base} --help`);
});
