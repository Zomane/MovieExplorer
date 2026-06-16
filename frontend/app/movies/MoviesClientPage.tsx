'use client'

import styles from './MoviesList.module.css'
import MovieCard from "@/components/movies/MovieCard"
import { useMovies } from "@/hooks/useMovies"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToggleSaveMovie } from '@/hooks/useUsers'
import { useAuth } from '@/providers/AuthProvider'


export default function MoviesPage() {

    const [error, setError] = useState<string | null>(null)
    const [isVisible, setIsVisible] = useState(false) 

    const auth = useAuth()
    const token = auth.token ?? ''

    const { data: movies, isLoading, error: moviesError, isError: isMovieError } = useMovies()
    const toggleMovieMutation = useToggleSaveMovie({token, updateUser: auth.updateUser, user: auth.user})
    const router = useRouter()

    const searchParams = useSearchParams()
    const q = searchParams.get('q') ?? ''
    const [search, setSearch] = useState(q)

    useEffect(() => {
        if (search.trim() === q.trim()) return
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())

            if (search.trim()) {
                params.set('q', search.trim())
            } else {
                params.delete('q')
            }

        const queryString = params.toString()

        router.replace(queryString ? `/movies?${queryString}` : '/movies')
        }, 500)

        return () => clearTimeout(timer)

    }, [search, router, searchParams, q])

    const handleNav = useCallback(
        (id: string) => {
            router.push(`/movies/${id}`)
        },[router]
    )

    const handleSave = useCallback(
        (movieId: string) => {
            if(!token || !auth.user){
                setError('Для сохранения фильма войдите в аккаунт')
                setIsVisible(true)
                return
            }
            toggleMovieMutation.mutate({
                userId: auth.user.id,
                movieId
            }, {
                onError: (error) => {
                    setError(error.message)
                    setIsVisible(true)
                }
            }
            
        )
        }, [toggleMovieMutation, auth.user, token]
    )

    useEffect(() => {
        if (!error) return
        const hideTimer = setTimeout(() => {
            setIsVisible(false)
        }, 2000)

        const timer = setTimeout(() => {
            setError(null)
            setIsVisible(false)
        }, 2300)

        return () => {
            clearTimeout(timer)
            clearTimeout(hideTimer)
        }
    }, [error])

    const filteredMovies = useMemo(() => 
        (movies ?? []).filter(movie => movie.title.toLowerCase().includes(q.trim().toLowerCase())
    ),[movies, q])

    return (
        <div className={styles.moviePage}>
            <h1>Список фильмов</h1>
            <input className={styles.search} value={search} placeholder="Введите название" onChange={(e) => setSearch(e.target.value)}/>

            {isLoading && <h3>Загрузка...</h3>}
            {!isLoading && isMovieError && <h3>{moviesError.message}</h3>}
            {!isLoading && !isMovieError && filteredMovies.length === 0 && <p>Фильм не найден</p>}
       
            <div className={styles.cardList}>
                {filteredMovies.map(movie => (
                    <MovieCard key={movie.id} movie={movie} user={auth.user} onNavigate={handleNav} onSave={handleSave}/>
                ))}
            </div>
            {error && <p className={`${styles.errorText} ${!isVisible?styles.hidden:''}`}>{error}</p>}
            
        </div>
    )
}