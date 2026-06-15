import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getMovieById } from '@/api/movies'

type Props = {
    params: Promise<{
        id: string
    }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params

    const movie = await getMovieById(id)

    if (!movie) {
        return {
            title: 'Фильм не найден',
            description: 'Такого фильма нет в каталоге MovieExplorer'
        }
    }

    return {
        title: `Фильм: ${movie.title}`,
        description: movie.description,
    }
}

export default async function MoviePage({ params }: Props) {
    const { id } = await params

    const movie = await getMovieById(id)

    if (!movie) {
        notFound()
    }

    return (
        <div>
            <h1>{movie.title}</h1>
            <p>{movie.description}</p>
        </div>
    )
}