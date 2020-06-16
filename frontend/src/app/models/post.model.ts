export interface Post {
    id: number,
    title: string,
    post_text: string,
    post_date: string,
    post_modified: string,
    user: number,
    comments: Array<any>,
    tags: Array<any>,
    imagepost: Array<any>
}