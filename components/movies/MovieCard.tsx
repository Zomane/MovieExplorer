import styles from './MovieCard.module.css'
import { type Movie } from "@/types/movie"
import React from "react";

type Props = {
    movie: Movie;
    onNavigate: (id: string) => void
}

const MovieCard = React.memo(function MovieCard({movie, onNavigate}: Props){
    const miniDescription = movie.body.length > 30 ? movie.body.slice(0, 30) : movie.body
    return (
        <div className={`${styles.card}`}>
            <h3>{movie.title}</h3>
            <p>{miniDescription}</p>
            <button className={styles.navButton} onClick={() => onNavigate(movie.id)}>Смотреть</button>
        </div>
    )
})

export default MovieCard