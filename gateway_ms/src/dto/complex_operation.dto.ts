import {
    IsString
} from "class-validator";

export class ComplexOperationDTO {
    @IsString()
    mathExpression: string;
}