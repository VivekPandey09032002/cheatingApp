import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./db/connection.js";
const app = express();

//static resourse
app.use("/",express.static('./public'))

//setup body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))

//setting view engine to ejs
app.set("view engine", "ejs");
app.set('views','./views')

//connect to db
connectDB("registerGfs", "mongodb://localhost:27017");

//router setup
app.use('/',userRoutes);



app.listen(8080, function () {
  console.log(`http://localhost:8080`);
});