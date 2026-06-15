import { type Movie } from "@/types/movieType";

export async function getMovies(): Promise<Movie[]> {
    const res = await fetch('http://localhost:3001/movies')
    if(!res.ok){
        throw new Error('Не удалось получить фильмы')
    }
    return await res.json()
}

export async function getMovieById(id: string): Promise<Movie | null> {
    const res = await fetch(`http://localhost:3001/movies/${id}`)

    if (res.status === 404) {
        return null
    }

    if(!res.ok){
        throw new Error('Не удалось получить фильм')
    }
    
    return await res.json()
}

