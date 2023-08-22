import express from 'express';
import UserController from '../controllers/user.controller';
import UserMiddleware from '../middlewares/user.middlewares';

const controller = new UserController()
const middlewares = new UserMiddleware()

const userRouter = express.Router();

//Rota Para Fazer Login
userRouter.post('/login', middlewares.login, (req, res) => controller.login(req, res));

//Rota Para Criar Um Usiario
userRouter.post('/', middlewares.create, (req, res) => controller.create(req, res));

//Rota Para Listar Todos Os Usuarios
userRouter.get('/', (_req, res) => controller.findAll(_req, res));

//Rota Para Pegar Um Usuario Pelo Seu Id
userRouter.get('/:user_id', middlewares.find, (req, res) => controller.findById(req, res));

//Rota Para Deletar Um Usuario Pelo Seu Id
userRouter.put('/:user_id', middlewares.find, (req, res) => controller.deleteById(req, res));

export default userRouter;
