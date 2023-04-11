import { IsString, IsUUID } from "class-validator";

export class DeleteRecordDTO {
    @IsString()
    @IsUUID()
    id: string
}