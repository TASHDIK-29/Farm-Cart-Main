import mongoose from "mongoose"
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config()

let server;


const startServer = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)

        console.log("Connected To Db....");

        server = app.listen(process.env.PORT, () => {
            console.log(`Server is listening to port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

startServer();


