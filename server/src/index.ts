import dotenv from "dotenv";
import cors from 'cors';
import mongoose from "mongoose";
import DotenvError from "./errors/dotenv-error.js";
import connectToDataBase from "./db/connectToDB.js";
import router from "./router.js";
import express, { Request, Response } from "express";
import connectionMiddleware from "./middlewares/connection.js";

if(process.env.NODE_ENV !== "test")
  dotenv.config();

const app = express();
const dbConn = process.env.DB_CONN;
const clientUrl = process.env.CLIENT_URL;

app.use(cors({
  credentials: true,
  origin: clientUrl
}));
app.use(express.json());

app.use(connectionMiddleware);

app.use(router);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});