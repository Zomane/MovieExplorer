import { Movie } from "@/types/movieType";
import { LoginDto, RegisterDto, User } from "@/types/userType";


export async function getUsers(): Promise<User[]> {
    const res = await fetch('http://localhost:3001/users')
    
    if(!res.ok){
        throw new Error('Не удалось получить пользователей')
    }
    const data = await res.json()
    return data
}

export async function getUserById(id: string): Promise<User> {
    const res = await fetch(`http://localhost:3001/users/${id}`)
    if(!res.ok){
        throw new Error('Ошибка в загрузке пользователей')
    }
    return await res.json()
}

export async function toggleSaveMovie(id: string, movieId: string, token: string): Promise<User> {
    const res = await fetch(`http://localhost:3001/users/${id}/favorites`, {
        method: 'PATCH',
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            movieId
        })
    })

    if (!res.ok) {
        const errorData = await res.json()

        throw new Error(
            errorData.message || 'Ошибка в отправке данных'
        )
    }
    
    return await res.json()
}

export async function registerUser({login, email, pass}: RegisterDto): Promise<{message: string}> {
    const res = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            login,
            email,
            pass
        })
    })

    if (!res.ok) {
        const errorData = await res.json()

        throw new Error(
            errorData.message || 'Ошибка регистрации'
        )
    }
    
    return await res.json()
}

export async function loginUser({login, pass}: LoginDto): Promise<{token: string, loginedUser: User}> {
    const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            login, 
            pass
        })
    })
    if(!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Ошибка входа в аккаунт')
    }

    return await res.json()
}

export async function getProfile(token: string): Promise<User> {
    const res = await fetch(`http://localhost:3001/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if(!res.ok){
        const errorData = await res.json()
        throw new Error(errorData.message || 'Ошибка сервера')
    }

    return await res.json()
    
}

export async function getSavedMovies(id: string): Promise<Movie[]>{
    const res = await fetch(`http://localhost:3001/users/${id}/savedMovies`)

    if(!res.ok){
        const errorData = await res.json()
        throw new Error(errorData || 'Ошибка сервера')
    }

    return await res.json()
}

export async function changeUserLogin(token: string, login: string) {
    const res = await fetch(`http://localhost:3001/profile/changeLogin`, {
        method: 'PATCH',
        headers: {
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body: JSON.stringify({
            login: login,
        })
    })

    if(!res.ok){
        const errrorData = await res.json()
        throw new Error(errrorData.message || 'Ошибка сервера')
    }

    return await res.json()
}

export async function changeUserPass(token: string, currentPass: string, newPass: string) {
    const res = await fetch('http://localhost:3001/profile/changePass', {
        method: 'PATCH',
        headers: {
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body: JSON.stringify({
            currentPass: currentPass,
            newPass: newPass
        })
    })

    if(!res.ok){
        const errrorData = await res.json()
        throw new Error(errrorData.message || 'Ошибка сервера')
    }

    return await res.json()
}