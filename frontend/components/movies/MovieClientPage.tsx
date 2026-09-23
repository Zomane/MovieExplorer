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
    const [failedImage, setFailedImage] = useState<string | null>(null)

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

    function handleNav(){
        router.replace('/movies')
    }


    return (
        <div className={styles.moviePage}>
            <div className={styles.movieCard}>
                <div className={styles.posterBlock}>
                    <Image className={styles.image} src={!movie.imgLink || failedImage === movie.imgLink ? '/poster-placeholder.svg' : movie.imgLink} onError={() => setFailedImage(movie.imgLink)} width={300} height={450} alt={movie.title} />
                </div>
                <div className={styles.movieInfo}>
                    <h1>{movie.title}</h1>
                    <div className={styles.meta}> 
                        <span>Год: {movie.year}</span>
                        <span>{movie.genre}</span>
                        <span className={styles.rating}>★ {movie.rating}</span>
                    </div>
                    <p className={styles.director}><span>Режиссёр</span>{movie.director}</p>
                    <p className={styles.description}>{movie.description}</p>
                    <div className={styles.btnsContainer}>
                        <button className={styles.saveBtn} onClick={handleSave} aria-pressed={isSaved} disabled={toggleMovieMutation.isPending}>{toggleMovieMutation.isPending ? 'Сохранение...' : isSaved ? 'Убрать из избранного' : 'В избранное'}</button>
                        <button className={styles.backBtn} onClick={handleNav}>К списку фильмов</button>
                    </div>
                    {error && <p role="alert" className={`${styles.errorText} ${!isVisible?styles.hidden:''}`}>{error}</p>}
                </div>
            </div>
            
        </div>
    )
}
