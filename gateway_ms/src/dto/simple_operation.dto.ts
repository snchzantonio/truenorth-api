import {
    IsString
    , IsArray
    , ValidateNested
    , ArrayMinSize
    , ArrayMaxSize
    ,IsNumber,
    IsIn
} from "class-validator";

export class SimpleOperationDTO {
    @IsString()
    @IsIn(['+', '-', '/', '*', '√'])
    operator: string;

    @ArrayMinSize(1)
    @ArrayMaxSize(255)
    @IsArray()
    @IsNumber({allowInfinity: false, allowNaN: false, maxDecimalPlaces: 3}, {each: true, message: 'Operands cannot contain infinity, NaN o more than 3 decimals'})
    operands: number[];
}