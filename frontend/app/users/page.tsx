'use client'

import UserCard from "@/components/users/UserCard";
import { useUsers } from "@/hooks/useUsers";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from './Users.module.css'

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

            const queryString = params.toString()
            router.replace(queryString ? `/users?${queryString}` : '/users')
        }, 500)

        return () => clearTimeout(timer)
    }, [search, router, searchParams, q])

    const filteredUsers = useMemo(() => (users??[]).filter(user => user.login.toLowerCase().includes(q.toLowerCase())), [users, q])
    
    const handleNav = useCallback(
        (id: string) => router.push(`/users/${id}`),
        [router] 
    )

    return (
        <div className={styles.usersPage}>
            <h1>Список пользователей</h1>
            <input className={styles.search} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Введите логин" />
            {isLoading && <h3>Загрузка...</h3>}
            {!isLoading && isError && <h3 className={styles.errorText}>{error.message}</h3>}
            {!isLoading && !isError && filteredUsers.length === 0 && <h3>Пользователь не найден</h3>}
            <div className={styles.usersGrid}>
                {filteredUsers.map(user => 
                        <UserCard key={user.id} user={user} onNavigate={handleNav}/>
                    )
                }
            </div>
        </div>
    )

}