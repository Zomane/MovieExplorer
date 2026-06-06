import { type User } from "@/types/user";

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