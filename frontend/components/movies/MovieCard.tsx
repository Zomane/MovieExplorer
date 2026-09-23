'use client'

import styles from './MovieCard.module.css'
import { type Movie } from "@/types/movieType"
import React, { useState } from "react"
import { User } from '@/types/userType'
import Image from 'next/image'

type Props = {
    movie: Movie;
    onNavigate: (id: string) => void
    onSave: (id: string) => void
    user: User | null
}

const MovieCard = React.memo(function MovieCard({movie, onNavigate, onSave, user}: Props){
    const [failedImage, setFailedImage] = useState<string | null>(null)
    const savedMovieIds = user?.savedMovieIds ?? []
    const isSaved = savedMovieIds.includes(movie.id)

    return (
        <article className={styles.card}>
            <Image className={styles.poster} src={!movie.imgLink || failedImage === movie.imgLink ? '/poster-placeholder.svg' : movie.imgLink} onError={() => setFailedImage(movie.imgLink)} width={200} height={300} sizes="(max-width: 600px) 45vw, (max-width: 1000px) 30vw, 280px" alt={movie.title}/>
            <h3>{movie.title}</h3>
            <div className={styles.meta}>
                <span>{movie.year}</span>
                <span className={styles.rating}>★ {movie.rating}</span>
            </div>
            <p className={styles.description}>{movie.director}</p>
            <button className={styles.navButton} onClick={() => onNavigate(movie.id)}>Подробнее</button>
            <button className={styles.saveButton} onClick={() => onSave(movie.id)} aria-pressed={isSaved} aria-label={`${isSaved ? 'Убрать из избранного' : 'Сохранить'}: ${movie.title}`} title={isSaved ? 'Убрать из избранного' : 'В избранное'}>
                <Image src={isSaved ? '/saved.svg' : '/save.svg'} width={50} height={50} alt=""/>
            </button>
        </article>
    )
})

export default MovieCard
