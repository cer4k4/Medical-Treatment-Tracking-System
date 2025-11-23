import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const configFile = {
  "adminUsername": process.env.ADMIN_USERNAME,
  "adminPassword": process.env.ADMIN_PASSWORD,
  "adminPhonenumber": process.env.ADMIN_PHONENUMBER,
  "hostAddress": process.env.HOST_ADDRESS,
  "hostPort": process.env.HOST_PORT,
  "dbHost": process.env.DB_HOST,
  "dbName": process.env.DB_NAME,
  "dbPort": process.env.DB_PORT,
  "uri": `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/`,
};
