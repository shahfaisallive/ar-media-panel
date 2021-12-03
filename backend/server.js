const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config()

// IMPORTING ROUTES HERE
const targetRoutes = require('./routes/targetRoutes')
const adminRoutes = require('./routes/adminRoutes')

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
    origin: "*",
    credentials: true,
}));

//Use the routes here
app.use('/api/targets', targetRoutes);
app.use('/api/admin', adminRoutes);


//Default route
app.use('/', (req, res) => res.send('Welcome to this Server'))

// Server start up and DB connect
mongoose.connect("mongodb+srv://cherry:asd123@nft-monsters.jhjvg.mongodb.net/hmon-monsters?retryWrites=true&w=majority")
.then(async ()=> {
    console.log('connected to MongoDB successfully...!');
}).catch(err=>{
    console.log('Error Connecting...')
    console.log(err)
})
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log('Server is running successfully on Port: ' + PORT)
})