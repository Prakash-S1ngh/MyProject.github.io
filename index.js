const express = require('express');
const { dbconnection } = require('./config/db.config');
const router = require('./routers/user.router'); 
const courseRouter = require('./routers/course.router');
const cookieParser = require('cookie-parser');

const app = express();

require('dotenv').config();

// Middleware to parse JSON
app.use(express.json());

app.use(cookieParser()); 

// Middleware to parse URL-encoded form data wthout files
app.use(express.urlencoded({ extended: true }));

dbconnection();
app.use('/v2/users', router);
app.use('/v2/courses', courseRouter);

app.get('/', () => {
  console.log("The server is running");
});

app.listen(process.env.PORT_NUMBER, () => {  
  console.log(`The server is running at port number: ${process.env.PORT_NUMBER}`);
});
