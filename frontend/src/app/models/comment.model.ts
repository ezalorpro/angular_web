import { UserData } from './userdata.model';

export interface Comment {
    id: number,
    content: string,
    date: string,
    post: number,
    user: UserData

}