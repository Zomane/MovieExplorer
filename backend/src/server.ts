import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { JwtPayload, UserEntity } from './types/user'
import { MovieEntity } from './types/movie'
import { Request, Response, NextFunction } from 'express'

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET not found')
}

const app = express()

app.use(cors({
    origin: 'http://localhost:3000'
}))

app.use(express.json())

app.listen( 3001, () => {
  console.log('Server started')
})

const users: UserEntity[] = [
    {
        id:"1781024263801",
        login:"stsipa",
        email:"step.tsipa@gmail.com",
        role:"user",
        pass:"$2b$10$wLo7kFr3zaljCx2vOZ.Kj.yfRQBFjphgE.o9t8mVaDvqeNQmWcLWa",
        savedMovieIds:[]
    },
    {
        id:"1781024275492",
        login:"stsipa1",
        email:"tsybulkin.step@mail.ru",
        role:"user",
        pass:"$2b$10$wLo7kFr3zaljCx2vOZ.Kj.yfRQBFjphgE.o9t8mVaDvqeNQmWcLWa",
        savedMovieIds:['3', '2']
    },
    {
        id:"178765275492",
        login:"user3",
        email:"user3@mail.ru",
        role:"user",
        pass:"$2b$10$iodiR5STz3xkHEHieWkZFeNj3H5tsw2sEgzkTcyNdm0wSuZF3a7ki",
        savedMovieIds:[]
    },
    {
        id:"165454275492",
        login:"user4",
        email:"user4@mail.ru",
        role:"user",
        pass:"$2b$10$iodiR5STz3xkHEHieWkZFeNj3H5tsw2sEgzkTcyNdm0wSuZF3a7ki",
        savedMovieIds:[]
    },
    {
        id:"178321275492",
        login:"user5",
        email:"user5@mail.ru",
        role:"user",
        pass:"$2b$10$iodiR5STz3xkHEHieWkZFeNj3H5tsw2sEgzkTcyNdm0wSuZF3a7ki",
        savedMovieIds:['1', '4']
    },
    {
        id:"1781024243292",
        login:"user6",
        email:"user6@mail.ru",
        role:"user",
        pass:"$2b$10$iodiR5STz3xkHEHieWkZFeNj3H5tsw2sEgzkTcyNdm0wSuZF3a7ki",
        savedMovieIds:['3','1']
    },
    {
        id:"1781023143292",
        login:"user7",
        email:"user7@mail.ru",
        role:"user",
        pass:"$2b$10$iodiR5STz3xkHEHieWkZFeNj3H5tsw2sEgzkTcyNdm0wSuZF3a7ki",
        savedMovieIds:['1', '2']
    }

]

const movies: MovieEntity[] = [
    {
        id: '1',
        title: 'Бэтмен: Начало',
        description: 'После гибели родителей Брюс Уэйн проходит путь от потерянного наследника до защитника Готэма, чтобы сразиться с преступностью и собственными страхами.',
        director: 'Кристофер Нолан',
        imgLink: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1704946/be4b776a-5ab6-42b4-9147-5c3ec6b53c44/600x900',
        genre: 'боевик, криминал, драма',
        year: 2005,
        rating: 8.2
    },
    {
        id: '2',
        title: 'Человек паук',
        description: 'Скромный школьник Питер Паркер получает сверхспособности после укуса генетически изменённого паука и учится быть героем.',
        director: 'Сэм Рэйми',
        imgLink: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1946459/428e2842-4157-45e8-a9af-1e5245e52c37/300x450',
        genre: 'боевик, фантастика, приключения',
        year: 2002,
        rating: 7.4
    },
    {
        id: '3',
        title: 'Во все тяжкие',
        description: 'Учитель химии Уолтер Уайт после тяжёлого диагноза начинает производить метамфетамин, постепенно превращаясь в одного из самых опасных людей криминального мира.',
        director: 'Винс Гиллиган',
        imgLink: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1900788/fb35416f-3b0d-4b96-bc65-cf6923f9e329/300x450',
        genre: 'криминал, драма, триллер',
        year: 2008,
        rating: 9.5
    },
    {
        id: '4',
        title: 'Остров проклятых',
        description: 'Федеральный маршал прибывает в психиатрическую клинику на изолированном острове, чтобы расследовать исчезновение пациентки, но вскоре начинает сомневаться в реальности происходящего.',
        director: 'Мартин Скорсезе',
        imgLink: 'https://avatars.mds.yandex.net/get-ott/224348/2a00000198528f853134273ea785844e1c8a/600x900',
        genre: 'детектив, триллер, драма',
        year: 2010,
        rating: 8.2
    }
]

type AuthRequest = Request & {
    user?: JwtPayload
}

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).json({
                message: 'Токен отсутствует'
            })
        }

        const token = authHeader.split(' ')[1]

        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET not found')
        }

        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload

        req.user = payload

        next()
    } catch {
        return res.status(401).json({
            message: 'Невалидный токен'
        })
    }
}


// users


app.get('/users', (req, res) => {
    const usersWithoutPass = users.map(user => ({
        id: user.id,
        login: user.login,
        email: user.email,
        role: user.role,
        savedMovieIds: user.savedMovieIds
    }))
    
    res.json(usersWithoutPass)
})

app.get('/users/:id', (req, res) => {
    const user = users.find(user=> user.id === req.params.id)

    if(!user){
        return res.status(404).json({
            message: 'Пользователь не найден'
        })
    }

    const userWithoutPass = {
        id: user.id,
        login: user.login,
        email: user.email,
        role: user.role,
        savedMovieIds: user.savedMovieIds
    }

    res.json(userWithoutPass)
})


app.get('/profile', authMiddleware, (req: AuthRequest, res) => {

    const user = users.find(user => user.id === req.user?.id)

    if(!user) {
        return res.status(404).json({
            message: 'Пользователь не найден'
        })  
    }

    const userWithoutPass = {
        id: user.id,
        login: user.login,
        email: user.email,
        role: user.role,
        savedMovieIds: user.savedMovieIds
    } 

    return res.status(200).json(userWithoutPass)
})

app.patch('/users/:id/favorites', authMiddleware, (req: AuthRequest, res) => {
    if (req.user?.id !== req.params.id) {
        return res.status(403).json({
            message: 'Нет доступа'
        })
    }

    const user = users.find(user => user.id === req.params.id)
    
    if(!user){
        return res.status(404).json({
            message: 'Пользователь не найден'
        })
    }
    
    const { movieId } = req.body

    const isFavorite = user.savedMovieIds.includes(movieId)

    user.savedMovieIds = isFavorite ? user.savedMovieIds.filter(id => id !== movieId) : [...user.savedMovieIds, movieId]

    const userWithoutPass = {
        id: user.id,
        login: user.login,
        email: user.email,
        role: user.role,
        savedMovieIds: user.savedMovieIds
    } 

    return res.json(userWithoutPass)
})

app.patch('/profile/changeLogin', authMiddleware, (req: AuthRequest, res) => {
    const user = users.find(user => user.id === req.user?.id)

    if(!user){
        return res.status(404).json({
            message: 'Пользователь не найден'
        })
    }

    const newLogin = req.body.login

    const isLoginExist = users.find(user => user.login === newLogin && user.id !== req.user?.id)

    if(!newLogin){
        return res.status(400).json({
            message: 'Введите логин'
        })
    }

    if(isLoginExist){
        return res.status(400).json({
            message: 'Этот логин уже занят'
        })
    }

    if(newLogin === user.login){
        return res.status(400).json({
            message: 'Новый логин должен отличаться от старого'
        })
    }

    if(newLogin.length < 5){
        return res.status(400).json({
            message: 'Логин должен быть не меньше 5 символов'
        })
    }

    user.login = newLogin

    const userWithoutPass = {
        id: user.id,
        login: user.login,
        email: user.email,
        role: user.role,
        savedMovieIds: user.savedMovieIds
    } 
    
    return res.json(userWithoutPass)
})


app.patch('/profile/changePass', authMiddleware, async (req: AuthRequest, res) => {
    try {  
        const user = users.find(user => user.id === req.user?.id)

        if(!user){
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        const newPass = req.body.newPass
        const currentPass = req.body.currentPass

        if(!newPass || !currentPass){
            return res.status(400).json({
                message: 'Заполните все поля'
            })
        }

        const isCorrectPass = await bcrypt.compare(currentPass, user.pass)
        const isSamePassword = await bcrypt.compare(newPass, user.pass)


        if(!isCorrectPass) {
            return res.status(400).json({
                message: 'Неверный текущий пароль'
            })
        }

        if(newPass.length < 8 || currentPass.length < 8) {
            return res.status(400).json({
                message: 'Пароль должен содержать не менее 8 символов'
            })
        }

        if(/^[A-Za-z]+$/.test(newPass) || /^\d+$/.test(newPass)) {
            return res.status(400).json({
                message: 'Новый пароль должен содержать как минимум 1 букву и 1 цифру'
            })
        }
        
        if(isSamePassword) {
            return res.status(400).json({
                message: 'Новый пароль должен отличаться от текущего'
            })
        }

        user.pass = await bcrypt.hash(newPass, 10)

        return res.status(200).json({
            message: 'Пароль успешно изменен'
        })

    } catch {
        return res.status(500).json({
            message: 'Ошибка сервера'
        })
    }

})

app.delete('/profile/delete', authMiddleware, (req: AuthRequest, res) => {
    const user = users.find(user => user.id === req.user?.id)

    if(!user){
        return res.status(404).json({
            message: 'Пользователь не найден'
        })
    }

    const deletedUserId = users.findIndex(user => user.id === req.user?.id)
    users.splice(deletedUserId, 1)

    return res.status(200).json({
        message: 'Аккаунт пользователя успешно удален'
    })
})


// movies


app.get('/movies', (req, res) => {
    res.json(movies)
})

app.get('/movies/:id', (req, res) => {
    const movie = movies.find(movie => movie.id === req.params.id)

    if(!movie){
        return res.status(404).json({
            message: 'Фильм не найден'
        })
    }

    res.json(movie)
})

app.get('/users/:id/savedMovies', (req, res) => {
    const user = users.find(user => user.id === req.params.id)
    if(!user){
        return (
            res.status(404).json({
                message: 'Пользователь не найден'
            })
        )
    }

    const savedMovies = movies.filter(movie =>
        user.savedMovieIds.includes(movie.id)
    )

    return res.json(savedMovies)
})


// auth


app.post('/auth/register', async(req, res) => {
    try {
        const {login, email, pass} = req.body
        const loginExists = users.some(user => user.login === login)
        const emailExists = users.some(user => user.email === email)
        if(!login || !email || !pass) {
            return res.status(400).json({
                message: 'Заполните все поля'
            })
        }

        if(loginExists) {
            return res.status(409).json({
                message: 'Логин уже занят'
            })
        }

        if(emailExists) {
            return res.status(409).json({
                message: 'Почта уже занята'
            })
        }

        if(login.length < 5){
            return res.status(400).json({
                message: 'Логин должен быть не меньше 5 символов'
            })
        }

        if(pass.length < 8) {
            return res.status(400).json({
                message: 'Пароль должен быть не меньше 8 символов'
            })
        }

        if(/^[A-Za-z]+$/.test(pass) || /^\d+$/.test(pass)) {
            return res.status(400).json({
                message: 'Пароль должен содержать как минимум 1 букву и 1 цифру'
            })
        }

        const hashedPass = await bcrypt.hash(pass, 10)

        const newUser: UserEntity = {
            id: Date.now().toString(),
            login,
            email,
            pass: hashedPass,
            role: 'user',
            savedMovieIds: []
        }
        
        users.push(newUser)
        res.status(201).json({
            message: 'Пользователь успешно зарегистрирован'
        })
    } catch {
        return res.status(500).json({
            message: 'Ошибка сервера'
        })
    }

})

app.post('/auth/login', async(req, res) => {
    try {
        const {login, pass} = req.body
        
        if (!login || !pass) {
            return res.status(400).json({
                message: 'Введите логин и пароль'
            })
        }

        const userLogin = users.find(user => user.login === login)


        if(!userLogin){
            return res.status(401).json({
                message: 'Неправильный логин или пароль'
            })
        }

        const isPass = await bcrypt.compare(pass, userLogin.pass)

        if(!isPass) {
            return res.status(401).json({
                message: 'Неправильный логин или пароль'
            })
        }

        const token = jwt.sign({
            id: userLogin.id,
            login: userLogin.login,
            role: userLogin.role
        }, JWT_SECRET, {
            expiresIn: '7d'
        })

        const loginedUser = {
            id: userLogin.id,
            login: userLogin.login,
            email: userLogin.email,
            role: userLogin.role,
            savedMovieIds: userLogin.savedMovieIds
        }
        return res.status(200).json({token, loginedUser})
    }catch{
        return res.status(500).json({
            message: 'Ошибка сервера'
        })
    }

})

