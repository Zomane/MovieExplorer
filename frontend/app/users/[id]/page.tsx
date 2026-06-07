import { getUserById } from "@/api/users"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Params = {
    params: Promise<{id: string}>
}

export async function generateMetadata({params}: Params): Promise<Metadata>{
    const {id} = await params
    const data = await getUserById(id)

    if(!data){
        return {title: 'Профиль не найден'}
    }

    return {
        title: `Пользователь: ${data.login}`,
        description: `Профиль пользователя ${data.login}`
    }
}

export default async function UserPage({params}: Params) {
    const {id} = await params
    const user = await getUserById(id)

    if(!user){
        notFound()
    }

    return (
        <div>
            <h1>Это пользователь: {user.login}</h1>
            <p>{user.email}</p>
            <p>{user.role}</p>
        </div>
        
    )
}