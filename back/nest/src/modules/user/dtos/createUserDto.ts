import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { UserStatus } from "../entities/user.entity";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly username: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly nickname: string

    @IsEnum(UserStatus)
    @ApiProperty({enum: UserStatus})
    readonly status: UserStatus = UserStatus.ONLINE
}