import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { UserEntity } from './types/user'


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

const users: UserEntity[] = []

const movies = [
    {
        id: '1',
        title: 'Batman',
        description: 'Good movie about rich strong guy by DC'
    },
    {
        id: '2',
        title: 'Spider-Man',
        description: 'Good superheroic movie by Marvel'
    }
]

app.get('/movies', (req, res) => {
    res.json(movies)
})

app.patch('/users/:id', (req, res) => {
    
})

app.patch('/users/:id/favorites', (res, req) => {
    
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
        description: req.body.description
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

app.get('/users', (req, res) => {
    console.log('EXPRESS USERS ROUTE')
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
                message: 'Пароль должен быть не меньше 8 символов'
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
        console.log('EXPRESS USERS ROUTE')
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

        return res.status(200).json({token})
    }catch{
        return res.status(500).json({
            message: 'Ошибка сервера'
        })
    }

})

