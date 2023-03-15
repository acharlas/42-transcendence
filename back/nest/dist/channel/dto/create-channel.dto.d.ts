import { ChannelType } from '@prisma/client';
export declare class CreateChannelDto {
    name: string;
    type?: ChannelType;
    password?: string;
}
