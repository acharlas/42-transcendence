export type Lobby = {
    id: string;
    playerOne: string;
    playerTwo: string;
    score: number[];
}

export type Player = {
    id: string;
    mmr: number;
}