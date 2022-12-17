import * as Bcrypt from "bcrypt";
import * as JWT from "jsonwebtoken";
import { UserService } from './user.service';
import { ExpressError } from '../errors/expressError';
import { RegisterUserDTO } from "../models/authentication/register-request.dto";
import { LoginRequestDTO } from "../models/authentication/login-request.dto";
import { LoginResponseDTO } from "../models/authentication/login-response.dto";
import { RegisterResponseDTO } from "../models/authentication/register-response.dto";

export class AuthService {

    userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async verifyUserId(id: string) {
        return await this.userService.findOne({ id: id });
    }

    async register(dto: RegisterUserDTO): Promise<RegisterResponseDTO> {
        const { username, email, password } = dto;
        const hashedPassword = await Bcrypt.hash(password, +process.env.SALT_ROUNDS!);
        const user = await this.userService.createUser({ username, email, password: hashedPassword });
        if (!user) {
            throw new ExpressError('Ocorreu um erro inesperado', 400);
        }
        return {
            message: `Bem-vindo ${user.username}`,
            user: {
                username: user.username,
                email: user.email
            }
        };
    }

    async login(dto: LoginRequestDTO): Promise<LoginResponseDTO> {
        const { email, password } = dto;
        //const hashedPassword = CryptoJS.HmacSHA256(password, 'changeme').toString(); //TODO(Joana): Alterar a key para um sitio seguro
        const user = await this.userService.findOne({ email });
        if (!user) {
            throw new ExpressError('Credenciais inválidas', 401);
        }
        console.log('Vou confirmar');

        const passwordMatch = await Bcrypt.compare(password, user.password);
        console.log('Confirmei');

        if (!passwordMatch) {
            throw new ExpressError('Credenciais inválidas', 401);
        }

        const token = JWT.sign({ email: user.email }, process.env.JWT_SECRET!, {
            expiresIn: +process.env.JWT_EXPIRES_IN!,
            issuer: process.env.JWT_ISSUER,
            audience: process.env.JWT_AUDIENCE
        });
        console.log('Gerei token');

        return {
            message: `Bem-vindo ${user.username}`,
            user: {
                username: user.username,
                email: user.email
            },
            token: token
        };
    }
};
