'use client'

import UserCard from "@/components/users/UserCard";
import { useUsers } from "@/hooks/useUsers";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function UsersPage(){
    const {data: users, isLoading, error, isError} = useUsers()

    const router = useRouter()
    const searchParams = useSearchParams()
    const q = searchParams.get('q') ?? ''
    const [search, setSearch] = useState(q)

    useEffect(() => {
        setSearch(q)
    }, [q])

    useEffect(()=>{
        if(search === q) return 

        const params = new URLSearchParams(searchParams.toString())

        const timer = setTimeout(()=>{
            if(search.trim()){
                params.set('q', search)
            } else {
                params.delete('q')
            }

            router.replace(`/users?${params.toString()}`)
        }, 500)

        return () => clearTimeout(timer)
    }, [search, router, searchParams, q])

    const filtredUsers = useMemo(() => (users??[]).filter(user => user.login.toLowerCase().includes(q.toLowerCase())), [users, q])
    
    const handleNav = useCallback(
        (id: string) => router.push(`/users/${id}`),
        [router] 
    )

    return (
        <div>
            <h1>Список пользователей</h1>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Введите логин" />
            {isLoading && <h3>Загрузка...</h3>}
            {!isLoading && isError && <h3>{error.message}</h3>}
            {!isLoading && !isError && filtredUsers.length === 0 && <h3>Пользователь не найден</h3>}
            <div>
                {filtredUsers.map(user => 
                        <UserCard key={user.id} user={user} onNavigate={handleNav}/>
                    )
                }
            </div>
        </div>
    )

}