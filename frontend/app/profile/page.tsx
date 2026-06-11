import Image from 'next/image'
import styles from './Profile.module.css'
import { useUserProfile } from '@/hooks/useUsers'
import { useAuth } from '@/providers/AuthProvider'
import { useMovies, useProfileMovies } from '@/hooks/useMovies'

export default function ProfilePage() {
  const auth = useAuth()
  if (!auth.token) {
    return <h1>Необходимо войти в аккаунт</h1>
  }
  const {data: profile, isError, error, isPending} = useUserProfile(auth.token)
  const {data: movies, isError: isMovieError, isPending: isMoviePending} = useProfileMovies(profile?.id ?? '')

  return (
  <div className={styles.profilePage}>
    {isPending && <h1>Загрузка...</h1>}
    {!isPending && isError && <h1>{error.message}</h1>}
    {!isPending && !isError && profile && (
      <div className={styles.userInfo}>
        <Image src='/userLogo.png' width={200} height={200} alt='profile image'/>
        <h3>Логин: {profile.login}</h3>
        <p>Почта: {profile.email}</p>
        <p>Роль: {profile.role}</p>
      </div>
    )}
    <div className={styles.savedFilms}>
      
    </div>

  </div>
  )
}