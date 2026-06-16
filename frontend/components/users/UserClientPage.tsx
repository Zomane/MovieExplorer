'use client'

import { useProfileMovies } from "@/hooks/useMovies"
import { useAuth } from "@/providers/AuthProvider"
import { User } from "@/types/userType"
import MovieCard from "../movies/MovieCard"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useToggleSaveMovie } from "@/hooks/useUsers"
import Image from 'next/image'
import styles from './UserPage.module.css'

type Params = {
    user: User
}


export default function UserClientPage({user}: Params) {
    const router = useRouter()
    const auth = useAuth()
    const token = auth.token ?? ''

    const [error, setError] = useState<string | null>(null)
    const [isVisible, setIsVisible] = useState(false)
    
    const {data: movies, isError: isMovieError, isPending: isMoviePending, error: movieError} = useProfileMovies(user.id ?? '')
    const movieMutation = useToggleSaveMovie({token, updateUser: auth.updateUser, user: auth.user})


    const handleNav = useCallback(
        (id: string) => {
            router.push(`/movies/${id}`)
        },[router]
    )
    
    const handleSave = useCallback(
        (movieId: string) => {
            if(!token || !auth.user) {
                setError('Для сохранения фильма войдите в аккаунт')
                setIsVisible(true)
                return
            }
            movieMutation.mutate({
                userId: auth.user.id,
                movieId
            }, 
            {onError: (error) => {
                setError(error.message)
                setIsVisible(true)
            }})
        }, [movieMutation, auth.user, token]
    )

    useEffect(() => {
        if(!error) return
        
        const hideTimer = setTimeout(() => {
            setIsVisible(false)
        }, 2000)

        const timer = setTimeout(() => {
            setError(null)
            setIsVisible(false)
        }, 2300)

        return () => {
            clearTimeout(hideTimer)
            clearTimeout(timer)
        }
    }, [error])

    return (
        <div className={styles.userPage}>
            <div className={styles.userCard}>
                <Image className={styles.logoImage} src="/userLogo.png" width={130} height={130} alt="profile image" />
                <div className={styles.profileInfo}>
                    <h2>{user.login}</h2>
                    <p>{user.email}</p>
                </div>
                
                <div className={styles.profileStats}>
                    <div className={styles.statItem}>
                        <span>Роль</span>
                        <strong>{user.role}</strong>
                    </div>

                    <div className={styles.statItem}>
                        <span>Сохранено фильмов</span>
                        <strong>{movies?.length ?? 0}</strong>
                    </div>
                </div>
            </div>
            <h1>Сохраненные фильмы</h1>

            <div className={styles.savedMovies}>
                {isMovieError && <h3>{movieError.message}</h3>}
                {!isMoviePending && !isMovieError && movies && movies.map(movie => (
                    <MovieCard key={movie.id} movie={movie} onNavigate={handleNav} onSave={handleSave} user={auth.user}/>
                ))}
                
                {!isMoviePending && !isMovieError && (movies?.length ?? 0) === 0 && (
                    <p className={`${styles.emptyText}`}>У {user.login} пока нет сохранённых фильмов</p>
                )}
            </div>
            {error && <p className={`${styles.errorText} ${!isVisible?styles.hidden:''}`}>{error}</p>}
        </div>
        
    )
}