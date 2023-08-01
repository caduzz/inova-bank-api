import { PromiseServiceResponse } from "./global"

export interface IUser {
    id: number,
    name: string,
    email: string,
    cpf: string,
    age: number,
    active: boolean,
}

export interface IUserCreate {
    name: string,
    email: string,
    cpf: string,
    age: number,
    active: boolean,
    password: string
}

export interface IUserFind {
    user_id: number,
}

// Typagem de response de array de users
export type UserServiceFindAllResponse = UserUniqueErrorResponse | UserUniqueSucessResponse

interface UserUniqueErrorResponse extends PromiseServiceResponse {
    error: true,
    user?: null
}
interface UserUniqueSucessResponse extends PromiseServiceResponse {
    error: false,
    user: IUser
} 

// Typagen de response de um unico usuario
export type UserServiceFindResponse = UserErrorResponse | UserSucessResponse

interface UserErrorResponse extends PromiseServiceResponse {
    error: true,
    users?: null
}
interface UserSucessResponse extends PromiseServiceResponse {
    error: false,
    users: IUser[]
}
