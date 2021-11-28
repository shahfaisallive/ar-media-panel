const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')

// IMPORTING ROUTES HERE
const targetRoutes = require('./routes/targetRoutes')

const app = express();
// app.use(express.json());

var jsonParser = bodyParser.json({limit:1024*1024*10, type:'application/json'}); 
var urlencodedParser = bodyParser.urlencoded({ extended:true,limit:1024*1024*10,type:'application/x-www-form-urlencoded' });
app.use(jsonParser);
app.use(urlencodedParser);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    credentials: true,
}));

//Use the routes here
app.use('/api/targets', targetRoutes);


//Default route
app.use('/', (req, res) => res.send('Welcome to this Server'))

// Server start up
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('Server is running successfully on Port: ' + PORT)
})