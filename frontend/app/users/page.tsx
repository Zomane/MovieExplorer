'use client'

import UserCard from "@/components/users/UserCard";
import Loader from "@/components/loading/Loader";
import { useUsers } from "@/hooks/useUsers";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from './Users.module.css'
import { useAuth } from "@/providers/AuthProvider";

export default function UsersPage(){
    const {data: users, isLoading, error, isError} = useUsers()
    const router = useRouter()
    const searchParams = useSearchParams()
    const q = searchParams.get('q') ?? ''
    const [search, setSearch] = useState(q)
    const auth = useAuth()
    const userId = auth.user?.id ?? ''

    useEffect(()=>{
        if(search.trim() === q.trim()) return 

        const timer = setTimeout(()=>{
            const params = new URLSearchParams(searchParams.toString())

            if(search.trim()){
                params.set('q', search.trim())
            } else {
                params.delete('q')
            }

            const queryString = params.toString()

            router.replace(queryString ? `/users?${queryString}` : '/users')
        }, 500)

        return () => clearTimeout(timer)
    }, [search, router, searchParams, q])

    const filteredUsers = useMemo(() => (users??[]).filter(user => user.id!==userId && user.login.toLowerCase().includes(q.trim().toLowerCase())), [users, q, userId])
    
    const handleNav = useCallback(
        (id: string) => router.push(`/users/${id}`),
        [router] 
    )

    return (
        <div className={styles.usersPage}>
            <div className={styles.pageHeader}>
                <div>
                    <h1>Коллекции</h1>
                    <p className={styles.subtitle}>Новые фильмы начинаются с чьей-то любимой коллекции.</p>
                </div>
                <input className={styles.search} type="search" aria-label="Поиск коллекций по имени" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск по имени" />
            </div>
            {!isLoading && !isError && <p className={styles.count} aria-live="polite">Найдено коллекций: {filteredUsers.length}</p>}
            {isLoading && <Loader />}
            {!isLoading && isError && <h3 className={styles.errorText}>{error.message}</h3>}
            {!isLoading && !isError && filteredUsers.length === 0 && <p className={styles.emptyText}>Коллекции не найдены. Попробуйте другое имя.</p>}
            <div className={styles.usersGrid}>
                {filteredUsers.map(user => 
                        <UserCard key={user.id} user={user} onNavigate={handleNav}/>
                    )
                }
            </div>
        </div>
    )

}
