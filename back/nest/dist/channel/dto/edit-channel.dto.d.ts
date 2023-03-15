import { ChannelType } from '@prisma/client';
export declare class EditChannelDto {
    name?: string;
    type?: ChannelType;
    password?: string;
}
