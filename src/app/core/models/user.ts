export interface User {
    username: string;
    uid: string;
    created: number;
    updated: number;
    email: string;
}

export interface LocalUser {
    uid: string;
    username: string;
    email: string;
    time: number;
    expire: number;
}
