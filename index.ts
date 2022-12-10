import express, { Express, Request, Response, NextFunction } from 'express';
const app: Express = express();

import { connect } from 'mongoose';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

import { ExpressError } from './src/errors/expressError';

import { UserController } from './src/controllers/user.controller';
import { AuthController } from './src/controllers/auth.controller';

connect('mongodb://localhost:27017/kind-karma')
    .then(() => console.log('Database connected'))
    .catch((err) => console.error.bind(console, "connection error:" + err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


app.use('/users', UserController);
app.use('/auth', AuthController);


app.use((err: ExpressError, req: Request, res: Response, next: NextFunction) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong'
    res.status(statusCode).send({ err });
});


app.listen(3000, () => {
    console.log('Listening on port 3000')
});