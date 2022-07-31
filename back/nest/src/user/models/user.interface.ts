export interface UserI{
    id: number;
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