'use client'

import Image from 'next/image'
import styles from './Profile.module.css'
import { useToggleSaveMovie, useUserProfile } from '@/hooks/useUsers'
import { useAuth } from '@/providers/AuthProvider'
import { useMovies, useProfileMovies } from '@/hooks/useMovies'
import MovieCard from '@/components/movies/MovieCard'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
export default function ProfilePage() {
  const router = useRouter()
  const auth = useAuth()
  const token = auth.token ?? ''

  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  
  const {data: profile, isError: isProfileError, error: profileError, isPending: isProfilePending} = useUserProfile(token)
  const {data: movies, isError: isMovieError, isPending: isMoviePending, error: movieError} = useProfileMovies(profile?.id ?? '')
  const toggleMovieMutation = useToggleSaveMovie({token, updateUser: auth.updateUser, user: auth.user})

  const isPending = isProfilePending || isMoviePending

  const handleSave = useCallback(
    (movieId: string) => {
        if(!token || !auth.user){
          setError('Для сохранения фильма войдите в аккаунт')
          setIsVisible(true)
          return
        }

        toggleMovieMutation.mutate({
            userId: auth.user.id,
            movieId
        }, {
            onError: (error) => {
                setError(error.message)
            }
        }  
      )
      }, [toggleMovieMutation, auth.user, token]
  )

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
  
  const handleNav = useCallback(
      (id: string) => {
          router.replace(`/movies/${id}`)
      },[router]
  )
  if (!token) {
    return <h1>Необходимо войти в аккаунт</h1>
  }

  return (
    <div className={styles.profilePage}>

      {isPending && <h1>Загрузка...</h1>}
      {!isPending && isProfileError && <h3 className={`${styles.errorText} ${!isVisible?styles.hidden:''}`}>{profileError.message}</h3>}
      {!isPending && !isProfileError && profile && (
        <div className={styles.userInfo}>
          <Image className={styles.logoImage} src='/userLogo.png' width={130} height={130} alt='profile image'/>
          <h2>{profile.login}</h2>
          <p>{profile.email}</p>
          <p>Роль: {profile.role}</p>
        </div>
      )}

      <h1>Сохраненные фильмы</h1>

      <div className={styles.savedFilms}>
        {isMovieError && <h3>{movieError.message}</h3>}
        {!isPending && !isMovieError && movies && movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} onNavigate={handleNav} onSave={handleSave} user={auth.user}/>
        ))}
        
        {!isPending && !isMovieError && movies.length === 0 && (
          <p className={`${styles.errorText} ${!isVisible?styles.hidden:''}`}>У вас пока нет сохранённых фильмов</p>
        )}
      </div>

      {error && <p className={`${styles.errorText} ${!isVisible?styles.hidden:''}`}>{error}</p>}

    </div>
  )
}