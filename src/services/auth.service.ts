import CryptoJS from "crypto-js";
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
        const hashedPassword = CryptoJS.HmacSHA256(password, 'changeme').toString(); //TODO(Joana): Alterar a key para um sitio seguro
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
        const hashedPassword = CryptoJS.HmacSHA256(password, 'changeme').toString(); //TODO(Joana): Alterar a key para um sitio seguro
        const user = await this.userService.findOne({ email, password: hashedPassword });
        if (!user) {
            throw new ExpressError('Credenciais inválidas', 400);
        }
        return {
            message: `Bem-vindo ${user.username}`,
            user: {
                username: user.username,
                email: user.email
            }
        };
    }
};
