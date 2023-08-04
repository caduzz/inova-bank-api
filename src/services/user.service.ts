import { PrismaClient } from "@prisma/client";

import { IUserCreate, UserServiceFindAllResponse, UserServiceFindResponse } from "../@types/user";
import { PromiseServiceResponse } from "../@types/global";

import crypt from "../utils/crypt";

export default class UserServices {
    private prisma: PrismaClient
    private crypt: crypt

    constructor () {
        this.prisma = new PrismaClient()
        this.crypt = new crypt()
    }

    async create (data: IUserCreate): Promise<PromiseServiceResponse> {
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

        return { error: false, msg: 'Sucess to insert user in data base', status: 200 }
    }

    async findAll (): Promise<UserServiceFindResponse> {
        const users = await this.prisma.user.findMany({where: { active: true }})

        if(users.length <= 0)
            return { error: true, msg: 'Users not found', status: 404 }

        return { error: false, msg: 'Users found successfully', status: 200, users }
    }

    async findById (id: number): Promise<UserServiceFindAllResponse> {
        const user = await this.prisma.user.findUnique({ where: { id } })

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