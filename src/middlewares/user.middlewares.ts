import { NextFunction, Request, Response } from "express"
import { IUserCreate, IUserFind } from "../@types/user"
import Joi from "joi"

export default class UserMiddleware {
    create (req: Request, res: Response, next: NextFunction) {
        const body:IUserCreate = req.body

        const schema = Joi.object<IUserCreate>({
            email: Joi
                .string()
                .email()
                .required()
                .max(100),
            name: Joi
                .string()
                .required()
                .max(200),
            password: Joi
                .string()
                .required()
                .max(34),
            active: Joi
                .boolean()
                .required(),
            age: Joi
                .number()
                .required()
                .integer(),
            cpf: Joi
                .string()
                .required()
                .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
        })

        const {error} = schema.validate(body)
        if(error) return res.status(500).json({ error: true, msg: error.message })

        next()
    }

    find (req: Request, res: Response, next: NextFunction) {
        const body = req.params

        const schema = Joi.object<IUserFind>({
            user_id: Joi
                .number()
                .required()
                .integer()
        })

        const {error} = schema.validate(body)
        if(error) return res.status(500).json({res: {error: true, msg: error.message, status: 500}})

        next()
    }
}