import { UserDTO } from "../user/user.dto";

export interface LoginResponseDTO {
    message: string;
    user: UserDTO;
    token: string;
}