import { ChannelUsers } from "src/entities/channelUsers.entity";
import { User, UserStatus } from "src/entities/user.entity";

export class CreateUserDto {
    username: string;
    nickname: string;
    status: UserStatus;
    wins: number;
    losses: number;
    channels: ChannelUsers[];
    friends: User[];
    blocked: User[];
}
