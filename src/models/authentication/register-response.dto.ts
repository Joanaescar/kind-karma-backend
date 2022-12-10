import { UserDTO } from "../user/user.dto";

export interface RegisterResponseDTO {
    message: string;
    user: UserDTO;
}