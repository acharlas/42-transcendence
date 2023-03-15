import { Channel, ChannelType, ChannelUser, User, UserPrivilege, UserStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto, EditChannelDto, JoinChannelDto } from './dto';
import { GetChannelById, MessageCont, Room } from './type_channel';
export declare class ChannelService {
    private prisma;
    constructor(prisma: PrismaService);
    createChannel(userID: string, dto: CreateChannelDto): Promise<Room>;
    getChannels(userId: string): Promise<{
        type: ChannelType;
        name: string;
        id: string;
    }[]>;
    getChannelById(channelId: string): Promise<GetChannelById>;
    editChannel(userId: string, channelId: string, dto: EditChannelDto): Promise<Channel>;
    deleteChannelById(userId: string, channelId: string): Promise<Channel>;
    joinChannelById(userId: string, channelId: string, dto: JoinChannelDto): Promise<Room>;
    joinPrivateChannel(user: User, channel: Channel): Promise<Room>;
    joinProtectedChannel(user: User, channel: Channel, dto: JoinChannelDto): Promise<Room>;
    joinUpdateChannel(user: User, channel: Channel): Promise<Room>;
    leaveChannel(userId: string, channelId: string): Promise<ChannelUser & {
        user: User;
    }>;
    getChannelMessage(channelId: string, userId: string): Promise<MessageCont[]>;
    addChannelMessage(userId: string, channelId: string, username: string, content: string): Promise<MessageCont>;
    channelUserUpdate(userId: string, toModified: string, channelId: string, priv: UserPrivilege, time: Date): Promise<void>;
    banUser(userId: string, channelId: string, Time: Date): Promise<void>;
    muteUser(userId: string, channelId: string, Time: Date): Promise<void>;
    changeUserPrivilege(userId: string, channelId: string, Time: Date, privilege: UserPrivilege): Promise<void>;
    getChannelUser(channelId: string): Promise<{
        privilege: string;
        username: string;
        nickname: string;
        status: UserStatus;
    }[]>;
    getUserRoom(userId: string): Promise<Room[]>;
    JoinChannelByName(name: string, userId: string, dto: JoinChannelDto): Promise<Room>;
    RemoveUser(userId: string, channelId: string): Promise<Channel>;
    CreateDm(userId: string, to: string): Promise<Room>;
    InviteUser(userId: string, userAdd: string, channelId: string): Promise<Room>;
}
