export interface UserI{
    id: string;
    //profile picture
    username: string,
    nickname: string,
    ladderLevel: number,
    stats: {
        wins: number,
        losses: number,
        //achievement
    },
}