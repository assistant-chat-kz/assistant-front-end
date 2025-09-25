export interface IUserResponce {
    id: string;
    name: string;
    surname: string;
    email: string;
    createdAt: Date;
    verify: boolean
    visits: number
}

export interface IUserNoAuthResponce {
    id: string;
    visits: number
    name?: string
}