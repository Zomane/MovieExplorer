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
        pass:"$2b$10$iodiR5STz3xkHEHieWkZFeNj3H5tsw2sEgzkTcyNdm0wSuZF3a7ki",
        savedMovieIds:[]
    }
]

const movies: MovieEntity[] = [
    {
        id: '1',
        title: 'Batman',
        description: 'Good movie about rich strong guy by DC',
        director: 'Christopher Nolan',
        imgLink: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1704946/be4b776a-5ab6-42b4-9147-5c3ec6b53c44/600x900'
    },
    {
        id: '2',
        title: 'Spider-Man',
        description: 'Good superheroic movie by Marvel',
        director: 'Sam Raimi',
        imgLink: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1946459/428e2842-4157-45e8-a9af-1e5245e52c37/300x450'
    }, 
    {
        id: '3',
        title: 'Breaking Bad',
        description: 'The best series about drugs in the world',
        director: 'Bryan Cranston',
        imgLink: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1900788/fb35416f-3b0d-4b96-bc65-cf6923f9e329/300x450'
    },
    {
        id: '4',
        title: 'Shutter Island',
        description: 'An exciting film about a detective leading an investigation on an island',
        director: 'Martin Scorsese',
        imgLink: 'https://avatars.mds.yandex.net/get-ott/224348/2a00000198528f853134273ea785844e1c8a/600x900'
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

// app.patch('/users/:id', (req, res) => {

// })


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

app.post('/movies', (req, res) => {
    const newMovie = {
        id: Date.now().toString(),
        title: req.body.title,
        description: req.body.description,
        director: req.body.director,
        imgLink: req.body.imgLink
    }

    movies.push(newMovie)

    res.status(201).json(newMovie)
})

app.delete('/movies/:id', (req, res) => {
    const index = movies.findIndex(
        movie => movie.id === req.params.id
    )

    if(index === -1){
        return res.status(404).json({
            message: 'Фильм не найден'
        })
    }

    movies.splice(index, 1)

    res.status(200).json({
        message: 'Удалено'
    })
})

app.get('/savedMovies/:id', (req, res) => {
    // реализация получения фильмов по savedMovieIds
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

