import { getUserById } from "@/api/users"
import UserClientPage from "@/components/users/UserClientPage"
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
        title: `Коллекция: ${data.login}`,
        description: `Коллекция фильмов ${data.login}`
    }
}

export default async function UserPage({params}: Params) {
    const {id} = await params
    const user = await getUserById(id)
    if(!user){
        notFound()
    }

    return (
        <UserClientPage user={user} />
        
    )
}