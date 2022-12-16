import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response, NextFunction } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';

import passport from 'passport';
import { Strategy as JwtStrategy, VerifiedCallback, StrategyOptions, ExtractJwt } from 'passport-jwt'

const options: StrategyOptions = {
    /*     jwtFromRequest: (req: express.Request): string | null => {
            const auth = req.headers.authorization;
            return auth ? auth : null;
        } */
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret',
    issuer: 'localhost',
    audience: 'localhost'
}

passport.use(new JwtStrategy(options, (payload: any, done: VerifiedCallback): void => {
    const userId = payload.sub;


}));

import { ExpressError } from './src/errors/expressError';
import { UserController } from './src/controllers/user.controller';
import { AuthController } from './src/controllers/auth.controller';

connect('mongodb://localhost:27017/kind-karma')
    .then(() => console.log('Database connected'))
    .catch((err) => console.error.bind(console, "connection error:" + err));

const app: Express = express();

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