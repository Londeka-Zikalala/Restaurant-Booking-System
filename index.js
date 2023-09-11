import express from "express";
import pgp from "pg-promise";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import flash from "flash-express";
import dotenv from 'dotenv';
import restaurant from "./services/restaurant.js";
dotenv.config();

const pgPromise = pgp();

// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// which db connection to use
const connectionString = process.env.DATABASE_URL;

const db = pgPromise(connectionString);
db.connect();
const app = express()
const restaurantTableBooking = restaurant(db);


app.use(express.static('public'));
app.use(flash());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const handlebarSetup = exphbs.engine({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.get("/", async (req, res) => {
    try{
        //Use the getTables function to get available tables
        const tables = await restaurantTableBooking.getTables()

        res.render('index', { tables })
    } 
    catch(error){
        console.error('Error fetching tables', error)
        req.flash('error','Error fetching tables')
        res.redirect('/')
    }
 
});


app.get("/bookings", (req, res) => {
    res.render('bookings', { tables : [{}, {}, {}, {}, {}, {}]})
});


var portNumber = process.env.PORT || 3000;

//start everything up
app.listen(portNumber, function () {
    console.log('🚀  server listening on:', portNumber);
});