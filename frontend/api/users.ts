import { User } from "@/types/userType";

export async function getUsers(): Promise<User[]> {
    const res = await fetch('http://localhost:3001/registredUsers')
    
    if(!res.ok){
        throw new Error('Не удалось получить пользователей')
    }
    const data = await res.json()
    return data
}

export async function getUserById(id: string): Promise<User> {
    const res = await fetch(`http://localhost:3001/registredUsers/${id}`)
    if(!res.ok){
        throw new Error('Ошибка в загрузке пользователей')
    }
    return await res.json()
}

export async function toggleSaveMovie(id: string, movieId: string): Promise<User> {
    
    const user = await getUserById(id);

    const savedMovieIds = user.savedMovieIds ?? []

    const isFavorite = user.savedMovieIds.includes(movieId)

    const updatedMovieIds = isFavorite ? savedMovieIds.filter(id => id !== movieId) : [...savedMovieIds, movieId]

    const res = await fetch(`http://localhost:3001/registredUsers/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            savedMovieIds: updatedMovieIds
        })
    })

    if(!res.ok){
        throw new Error('Ошибка в отправке данных')
    }
    
    return await res.json()
}
