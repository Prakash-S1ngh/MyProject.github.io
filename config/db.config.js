const mongoose = require('mongoose');

exports.dbconnection = async()=>{
    try {
        const res = await mongoose.connect(process.env.db_url);
        console.log("The database is connected");
        
    } catch (error) {
        console.log("An error occured in db connection");
        console.error(error);
        process.exit(1);
    }
}