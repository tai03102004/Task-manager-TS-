import express, { Express} from "express";

import dotenv from "dotenv";

import mainV1Routes from "./api/v1/routes/index.route";

import * as database from "./config/database";

import cors from "cors";

dotenv.config();

database.connect();

const app: Express = express();

const port : number | string = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

mainV1Routes(app);

app.listen (port ,()  => {
    console.log(`App listening on port ${port}`);
} );