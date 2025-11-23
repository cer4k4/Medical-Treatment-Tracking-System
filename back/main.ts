import express from "express";
import getConnectionToDB from "./db/connect-to-db";
import baseRouter from "./routes/baseRouter";
import morgan from "morgan";
import { addAdmin } from "./seeder/createAdmin";
import cors from "cors";

const app: express.Application = express();

// CORS Middleware
app.use(
  cors({
    origin: "*", // allow all (good for development)
    methods: ["GET", "POST", "PATCH", "DELETE","PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
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

const port: number = 4000;

app.listen(port, () => {
  console.log(`TypeScript with Express 
         http://127.0.0.1:${port}/`);
});
