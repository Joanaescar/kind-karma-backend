import express, { Request, Response } from 'express';
import passport from 'passport'
import { UserService } from '../services/user.service';
export const UserController = express.Router();

const userService = new UserService();

UserController.get('/', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    const allUsers = await userService.findAll();
    res.send(allUsers);
});

