'use client'

import styles from './Movies.module.css'
import MovieCard from "@/components/movies/MovieCard"
import { useMovies } from "@/hooks/useMovies"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"


export default function MoviesPage() {

    const { data: movies, isLoading, error, isError } = useMovies()

    const router = useRouter()
    const searchParams = useSearchParams()

    const q = searchParams.get('q') ?? ''

    const [search, setSearch] = useState(q)

    useEffect(() => {
        setSearch(q)
    }, [q])

    useEffect(() => {
        const timer = setTimeout(() => {

            if(search === q) return

            const params = new URLSearchParams(searchParams.toString())

            if (search.trim()) {
                params.set('q', search)
            } else {
                params.delete('q')
            }

            router.replace(`/movies?${params.toString()}`)
        }, 500)

        return () => clearTimeout(timer)

    }, [search, router, searchParams, q])

    const handleNav = useCallback(
        (id: string) => {
            router.push(`/movies/${id}`)
        },[router]
    )

    const filteredMovies = useMemo(() => 
        (movies ?? []).filter(movie => movie.title.toLowerCase().includes(q.toLowerCase())
    ),[movies, q])

    return (
        <div className={styles.moviePage}>
            <h1>Список фильмов</h1>
            <input className={styles.search} value={search} placeholder="Введите название" onChange={(e) => setSearch(e.target.value)}/>

            {isLoading && <h3>Загрузка...</h3>}
            {!isLoading && isError && <h3>{error.message}</h3>}
            {!isLoading && !isError && filteredMovies.length === 0 && <p>{'Такого фильма не существует :('}</p>}
       
            <div className={styles.cardList}>
                {filteredMovies.map(movie => (
                    <MovieCard key={movie.id} movie={movie} onNavigate={handleNav}/>
                ))}
            </div>
        </div>
    )
}