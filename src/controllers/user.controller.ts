import { Request, Response } from "express";
import { IUserCreate } from "../@types/user";

import UserServices from "../services/user.service";

export default class UserController {
    private service: UserServices
    
    constructor () {
        this.service = new UserServices()
    }
    
    async create (req: Request, res: Response) {
        const data:IUserCreate = req.body

        const { status, error, msg } = await this.service.create(data)

        res.status(status).json({ error, msg })
    }

    async findAll (_req: Request, res: Response) {
        const { error, status, msg, users } = await this.service.findAll()

        res.status(status).json({ error, msg, users })
    }

    async findById (req: Request, res: Response) {
        const id = req.params.user_id

        const { error, status, msg, user } = await this.service.findById(Number(id))

        res.status(status).json({ error, msg, user })
    }

    async deleteById (req: Request, res: Response) {
        const id = req.params.user_id

        const { error, status, msg } = await this.service.deleteById(Number(id))

        res.status(status).json({ error, msg })
    }
}