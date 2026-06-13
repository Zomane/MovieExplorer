'use client'

import Link from 'next/link'
import styles from './Navbar.module.css'
import Image from 'next/image'
import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'


export default function Navbar(){
    const auth = useAuth()
    const router = useRouter()
    function handleExit(){
        auth.logout()
        router.replace('/login')
    }

    return (
        <div className={styles.header}>
            <div className={styles.nav}>
                <Image src="/navLogo.png" alt='logo' width={50} height={50} />
                <Link className={styles.link} href='/movies'>Список фильмов</Link>
                <Link className={styles.link} href='/users'>Пользователи</Link>
            </div>
            <div className={styles.loginNav}>
                {!auth.token ? (
                    <>
                        <Link className={styles.link} href='/login'>Вход</Link> 
                        <Link className={styles.link} href='/registration'>Регистрация</Link>
                    </>
                ) : (
                    <div className={styles.dropdown}>
                        <div className={styles.user}> 
                            <p className={styles.link}>{auth.user?.login}</p>
                            <Image src='/userLogo.png' width={35} height={35} alt='user logo'/>
                        </div>
                        <div className={styles.dropdownContent}>
                            <Link href='/profile' className={styles.dropdownLink}>Профиль</Link>
                            <Link href='/settings' className={styles.dropdownLink}>Настройки</Link>
                            <button className={styles.logout} onClick={handleExit}>Выйти</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}