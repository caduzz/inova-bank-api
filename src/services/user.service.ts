import { PrismaClient } from "@prisma/client";

import { IUserCreate, IUserLogin, UserLoginResponse, UserServiceFindAllResponse, UserServiceFindResponse } from "../@types/user";
import { PromiseServiceResponse } from "../@types/global";

import crypt from "../utils/crypt";
import TokenManager from "../utils/token";

export default class UserServices {
    private prisma: PrismaClient
    private crypt: crypt
    private tokenManager: TokenManager

    constructor () {
        this.prisma = new PrismaClient()
        this.crypt = new crypt()
        this.tokenManager = new TokenManager()
    }

    async login ({ email, cpf, password }: IUserLogin): Promise<UserLoginResponse> {
        const user = await this.prisma.user.findFirst({ 
            where: { 
                OR: [
                    { email }, 
                    { cpf }
                ]
            }
        })
        
        if(user){
            this.crypt.encrypt_validate(password, user.password)

            const token = this.tokenManager.getToken(user.id)

            return { error: false, status: 200, token }
        }

        return { error: true, msg: 'User Not Found', status: 404 }
    }

    async create (data: IUserCreate): Promise<UserLoginResponse> {
        data.password = await this.crypt.encrypt(data.password)

        const validateUser = await this.prisma.user.findMany({ 
            where: { 
                OR: [
                    {email: data.email},
                    {cpf: data.cpf}
                ]
            }
        })

        if(validateUser.length > 0)
            return {error: true, status: 400, msg: 'Email or Cpf already registered' }

        const user = await this.prisma.user.create({ 
            data, 
            select: { 
                id: true,
                name: true,
                email: true,
                age: true,
                cpf: true,
                active: true
            }
        })

        if(!user)
            return { error: true, msg: 'Error to inser user in data base', status: 400 }

        const token = this.tokenManager.getToken(user.id)

        return { error: false, status: 200, token }
    }

    async findAll (): Promise<UserServiceFindResponse> {
        const users = await this.prisma.user.findMany({ 
            where: { active: true },
            select: { 
                id: true, 
                active: true, 
                age: true, 
                cpf: true, 
                email: true, 
                name: true 
            }
        })

        if(users.length <= 0)
            return { error: true, msg: 'Users not found', status: 404 }

        return { error: false, msg: 'Users found successfully', status: 200, users }
    }

    async findById (id: number): Promise<UserServiceFindAllResponse> {
        const user = await this.prisma.user.findUnique({ 
            where: { id }, 
            select: { 
                id: true, 
                active: true, 
                age: true, 
                cpf: true, 
                email: true, 
                name: true 
            } 
        })

        if(!user)
            return { error: true, msg: 'User not found', status: 404 }

        return { error: false, msg: 'User found successfully', status: 200, user }
    }

    async deleteById (id: number): Promise<PromiseServiceResponse> {
        const user = await this.prisma.user.updateMany({ where: { AND: { id, active: true } }, data: { active: false } })
    
        if(user.count === 0)
            return { error: false, msg: 'User not found', status: 404}

        return { error: false, msg: 'User deleted sucess', status: 200}
    }
}