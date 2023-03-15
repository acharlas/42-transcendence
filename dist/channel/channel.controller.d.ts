import { ChannelService } from './channel.service';
import { CreateChannelDto, EditChannelDto, JoinChannelDto } from './dto';
import { Channel, ChannelType, ChannelUser } from '@prisma/client';
import { GetChannelById, MessageCont, Room } from './type_channel';
export declare class ChannelController {
    private channelService;
    constructor(channelService: ChannelService);
    createChannel(userId: string, dto: CreateChannelDto): Promise<Room>;
    getChannels(userId: string): Promise<{
        id: string;
        name: string;
        type: ChannelType;
    }[]>;
    getChannelById(channelId: string): Promise<GetChannelById>;
    editChannel(userId: string, channelId: string, dto: EditChannelDto): Promise<Channel>;
    deleteChannelById(userId: string, channelId: string): Promise<Channel>;
    joinChannel(userId: string, channelId: string, dto: JoinChannelDto): Promise<Room>;
    leaveChannel(userId: string, channelId: string): Promise<ChannelUser>;
    getChannelMessage(userId: string, channelId: string): Promise<MessageCont[]>;
}
