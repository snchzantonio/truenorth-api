import { IsIn, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from "class-validator";

export class ReportDTO {
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
    @IsPositive()
    @IsOptional()
    @Min(1)
    page: number = 1;

    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
    @IsPositive()
    @IsOptional()
    @Max(100)
    @Min(1)
    perPage: number = 10;

    @IsString()
    @IsOptional()
    @IsIn(['date', 'operation_type'])
    sort: string = 'date';

    @IsString()
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    order: string = 'DESC';

    @IsString()
    @IsOptional()
    like: string = null;
}