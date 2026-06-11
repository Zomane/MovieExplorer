'use client'

import styles from './MovieCard.module.css'
import { type Movie } from "@/types/movieType"
import React from "react";
import { User } from '@/types/userType';
import Image from 'next/image';

type Props = {
    movie: Movie;
    onNavigate: (id: string) => void
    onSave: (id: string) => void
    user: User | null
}

const MovieCard = React.memo(function MovieCard({movie, onNavigate, onSave, user}: Props){
    const director = movie.director.length > 30 ? movie.director.slice(0, 30) : movie.director
    const savedMovieIds = user?.savedMovieIds ?? []
    const isSaved = savedMovieIds.includes(movie.id)
    const link: string = movie.imgLink
    return (
        <div className={`${styles.card}`}>
            <Image className={styles.poster} src={link} width={200} height={300} loading="eager" alt='Movie Image'/>
            <h3>{movie.title}</h3>
            <p className={styles.description}>Directed by: {director}</p>
            <button className={styles.navButton} onClick={() => onNavigate(movie.id)}>Смотреть</button>
            <button className={styles.saveButton} onClick={() => onSave(movie.id)}>
                <Image src={isSaved?'/saved.svg' : '/save.svg'} width={27} height={27} alt='Save button'/>
            </button>
        </div>
    )
})

export default MovieCard


