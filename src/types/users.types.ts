export interface IUserResponce {
    id: string;
    name: string;
    surname: string;
    email: string;
    createdAt: Date;
    verify: boolean
}

export interface IUserNoAuthResponce {
    id: string;
}