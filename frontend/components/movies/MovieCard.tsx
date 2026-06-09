'use client'

import { useUserById } from '@/hooks/useUsers';
import styles from './MovieCard.module.css'
import { type Movie } from "@/types/movieType"
import React from "react";
import { User } from '@/types/userType';

type Props = {
    movie: Movie;
    onNavigate: (id: string) => void
    onSave: (id: string) => void
    user?: User
}

const MovieCard = React.memo(function MovieCard({movie, onNavigate, onSave, user}: Props){

    const miniDescription = movie.description.length > 30 ? movie.description.slice(0, 30) : movie.description
    const savedMovieIds = user?.savedMovieIds ?? []
    const isSaved = savedMovieIds.includes(movie.id)
    return (
        <div className={`${styles.card}`}>
            <h3>{movie.title}</h3>
            <p>{miniDescription}</p>
            <button className={styles.navButton} onClick={() => onNavigate(movie.id)}>Смотреть</button>
            <button className={styles.saveButton} onClick={() => onSave(movie.id)}>{isSaved?'Убрать':'Сохранить'}</button>
        </div>
    )
})

export default MovieCard