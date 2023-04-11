import { IsString } from "class-validator";

export class RegisterUserDTO {
    @IsString()
    username: string;
    
    @IsString()
    password: string;
}