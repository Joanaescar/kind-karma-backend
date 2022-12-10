import express, { Request, Response } from 'express';
import { catchAsync } from '../errors/catchAsync';
export const AuthController = express.Router();

import { AuthService } from '../services/auth.service';

const authService = new AuthService();

AuthController.post('/register', async (req: Request, res: Response) => {
    const response = await authService.register(req.body);
    res.send(response)
});

AuthController.post('/login', catchAsync(async (req: Request, res: Response) => {
    const response = await authService.login(req.body);
    res.send(response)
}));
