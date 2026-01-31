import express from "express";
import getConnectionToDB from "./db/connect-to-db";
import baseRouter from "./routes/baseRouter";
import morgan from "morgan";
import { addAdmin } from "./seeder/createAdmin";
import cors from "cors";
import { hostname } from "os";
import { config } from "dotenv";
import { configFile } from "./config/config";

const app: express.Application = express();

// CORS Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://172.17.0.3:3000",
  "http://172.17.0.3:4000",
  "http://127.0.0.1:4000",
  "http://localhost:4000",
  "http://185.97.116.253:3000",
  "http://185.97.116.253:4000",
  configFile.hostAddress+":"+configFile.hostPort,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Body Parser
app.use(express.json(), express.urlencoded({ extended: false }));
// Request Logger
app.use(morgan("dev"));

app.use("/", baseRouter);

const start = async () => {
  try {
    await getConnectionToDB();
  } catch (err) {
    console.log(err);
  }
  await addAdmin()
};

start();

const port: number = Number(configFile.hostPort);
const host: string = configFile.hostAddress || "127.0.0.1";
app.listen(port, () => {
  console.log(`TypeScript with Express 
         http://${host}:${port}/`);
});
