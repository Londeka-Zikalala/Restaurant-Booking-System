import express from "express";
import pgp from "pg-promise";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import flash from "express-flash";
import dotenv from 'dotenv';
import session from 'express-session';
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
app.use(session({
    secret: 'none',
    resave: false,
    saveUninitialized: true
  }));
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

        res.render('index', { tables,
            messages: req.flash() })
         console.log(tables)
    } 
    catch(error){
        console.error('Error fetching tables', error)
        req.flash('error','Error fetching tables')
        res.redirect('/')
    }
 
});

app.post('/book', async (req, res)=>{
   try{
    const tableName = req.body.tableId;
    const username = req.body.username;
    const phoneNumber = req.body.phone_number;
    const seats = req.body.booking_size;

        //make a booking
        const booked = await restaurantTableBooking.bookTable({tableName, username, phoneNumber, seats})
        
        // Update the list of tables
        const tables = await restaurantTableBooking.getTables();

        req.flash('success', 'Booking successful')
        res.render('index', {
            tables,
            booked,
            messages: req.flash()
        })
       
    } catch(error){
        console.error('Error making a booking', error)
        req.flash('error','Error making a booking')
        res.redirect('/')
    }
    
})
app.get('/bookings', async (req, res) => {
    try {
        const bookedTables = await restaurantTableBooking.getBookedTables();

        res.render('bookings', { bookedTables });
    } catch(error){
        console.error('Error fetching a booking', error)
        req.flash('error','Error fetching a booking')
        res.redirect('/bookings')
    }
    
});

app.get('bookings/:username', async (req, res)=>{
    const username = req.params.username;
    try {
        const bookedTablePerUser = await restaurantTableBooking.getBookedTablesForUser(username);

        res.render('bookings', { bookedTablePerUser });
    } catch(error){
        console.error('Error fetching a booking', error)
        req.flash('error','Error fetching a booking')
        res.redirect('/bookings')
    }
    
})

app.post('/cancel', async (req, res)=>{
    const tableName = req.body.tableName;

    try {
        await restaurantTableBooking.cancelTableBooking(tableName);
        req.flash('success', 'Booking cancelled')
        res.redirect('/bookings')
}catch(error){
    console.error('Error cancelling booking', error)
    req.flash('error','Error cancelling  booking')
    res.redirect('/bookings')
}

});

var portNumber = process.env.PORT || 3000;

//start everything up
app.listen(portNumber, function () {
    console.log('🚀  server listening on:', portNumber);
});