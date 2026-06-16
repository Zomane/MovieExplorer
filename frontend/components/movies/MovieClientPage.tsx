'use client'

import styles from './Movie.module.css'
import Image from 'next/image'
import { Movie } from '@/types/movieType'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import { useToggleSaveMovie } from '@/hooks/useUsers'
import { useEffect, useState } from 'react'

type Props = {
    movie: Movie
}

export default function MovieClientPage({movie}: Props) {
    const auth = useAuth()
    const token = auth.token ?? ''

    const [error, setError] = useState<string | null>(null)
    const [isVisible, setIsVisible] = useState(false)     

    const router = useRouter()
    const toggleMovieMutation = useToggleSaveMovie({token, updateUser: auth.updateUser, user: auth.user})
    const isSaved = auth.user?.savedMovieIds?.includes(movie.id) ?? false
    function handleSave(){
        if(!token || !auth.user){
            setError('Для сохранения фильма войдите в аккаунт')
            setIsVisible(true)
            return
        }
        toggleMovieMutation.mutate({
            userId: auth.user.id,
            movieId: movie.id
        }, 
        {
            onError: (error) => {
                setError(error.message)
                setIsVisible(true)
            }
        })
    }
    
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

    function handleNav(){
        router.replace('/movies')
    }


    return (
        <div className={styles.moviePage}>
            <div className={styles.movieCard}>
                <Image className={styles.image} src={movie.imgLink} width={300} height={450} alt='movie image' />
                <div className={styles.movieInfo}>
                    <h1>{movie.title}</h1>
                    <div className={styles.meta}> 
                        <span>{movie.year}</span>

                        <span>{movie.genre}</span>
  
                        <span>⭐ {movie.rating}</span>
                    </div>
                    <p className={styles.director}>Режиссер: {movie.director}</p>
                    <p className={styles.description}>{movie.description}</p>
                    <div className={styles.btnsContainer}>
                        <button className={styles.saveBtn} onClick={handleSave} disabled={toggleMovieMutation.isPending}>{isSaved?'Убрать':'Сохранить'}</button>
                        <button className={styles.backBtn} onClick={handleNav}>К списку фильмов</button>
                    </div>
                </div>
            </div>
            {error && <p className={`${styles.errorText} ${!isVisible?styles.hidden:''}`}>{error}</p>}
        </div>
    )
}