export interface User {
    _id: string,
    username: string,
    password: string,
    isAdmin: boolean,
    phone?: string,
    address?: string
}
