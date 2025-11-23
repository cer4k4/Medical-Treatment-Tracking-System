import mongoose from "mongoose";
import { configFile } from "../config/config";

async function getConnectionDB() {
    await mongoose.connect(`mongodb://${configFile.dbHost}:${configFile.dbPort}/${configFile.dbName}`).then(() => {
        console.log("Connected to database");
    }).catch((error) => {
        console.log("Error:", error);
        process.exit(1);
    });
}


export default getConnectionDB