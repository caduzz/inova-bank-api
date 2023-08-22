import { NextFunction, Request, Response } from "express"
import { IUserCreate, IUserFind, IUserLogin } from "../@types/user"
import Joi from "joi"

export default class UserMiddleware {

    login (req: Request, res: Response, next: NextFunction) {
        const body: IUserLogin = req.body

        if(!body.cpf && !body.email)
            return res.status(400).json({ error: true, msg: 'Cpf and Email is empty' }) 

        const schema = Joi.object<IUserLogin>({
            email: Joi
                .string()
                .email()
                .max(100),
            cpf: Joi
                .string()
                .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
            password: Joi
                .string()
                .required()
                .max(34)
        })

        const {error} = schema.validate(body)
        if(error) return res.status(500).json({ error: true, msg: error.message })

        next()
    }

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
        if(error) return res.status(400).json({ error: true, msg: error.message })

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