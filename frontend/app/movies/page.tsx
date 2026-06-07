import type { Metadata } from 'next'
import MoviesClientPage from './MoviesClientPage'

export const metadata: Metadata = {
  title: 'Фильмы',
  description: 'Список фильмов в Movie Explorer',
}

export default function MoviesPage() {
  return <MoviesClientPage />
}