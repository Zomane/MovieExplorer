'use client'

import styles from './MoviesList.module.css'
import MovieCard from "@/components/movies/MovieCard"
import Loader from "@/components/loading/Loader"
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
        }, 4500)

        const timer = setTimeout(() => {
            setError(null)
            setIsVisible(false)
        }, 5000)

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
            <div className={styles.pageHeader}>
                <div>
                    <h1>Фильмы</h1>
                    <p className={styles.subtitle}>Найдите кино, к которому захочется вернуться.</p>
                </div>
                <input className={styles.search} type="search" aria-label="Поиск фильмов" value={search} placeholder="Поиск по названию" onChange={(e) => setSearch(e.target.value)}/>
            </div>
            {!isLoading && !isMovieError && <p className={styles.count} aria-live="polite">Найдено фильмов: {filteredMovies.length}</p>}

            {isLoading && <Loader cards />}
            {!isLoading && isMovieError && <p className={styles.errorText} role="alert">{moviesError.message}</p>}
            {!isLoading && !isMovieError && filteredMovies.length === 0 && <p className={styles.emptyText}>Ничего не найдено. Попробуйте другое название.</p>}
       
            <div className={styles.cardList}>
                {filteredMovies.map(movie => (
                    <MovieCard key={movie.id} movie={movie} user={auth.user} onNavigate={handleNav} onSave={handleSave}/>
                ))}
            </div>
            {error && <p className={`${styles.errorText} ${!isVisible?styles.hidden:''}`}>{error}</p>}
            
        </div>
    )
}
