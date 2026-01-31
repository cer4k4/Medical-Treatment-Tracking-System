import mongoose from "mongoose";
import { configFile } from "../config/config";

async function getConnectionDB() {
    try {
        // Debug: Print config values (remove password in production!)
        console.log("DB Config:", {
            username: configFile.dbUserName,
            password: configFile.dbPassword,
            host: configFile.dbHost,
            port: configFile.dbPort,
            database: configFile.dbName
        });
        
        const mongoUri = `mongodb://${configFile.dbUserName}:${configFile.dbPassword}@${configFile.dbHost}:${configFile.dbPort}/${configFile.dbName}?authSource=admin`;
        
        // Debug: Print connection string (REMOVE IN PRODUCTION!)
        console.log("Connection URI:", mongoUri.replace(/:([^@]+)@/, ':***@'));
        
        await mongoose.connect(mongoUri);
        console.log("✅ Connected to database");
    } catch (error) {
        console.error("❌ Database connection error:", error);
        process.exit(1);
    }
}

export default getConnectionDB;