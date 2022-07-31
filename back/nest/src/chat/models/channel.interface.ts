export interface ChannelI{
    id: number;
    messages: [{
        userid: number,
        timestamp: string,
        content: string
    }]
}