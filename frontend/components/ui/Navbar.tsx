'use client'

import Link from 'next/link'
import styles from './Navbar.module.css'
import { useAuth } from '@/providers/AuthProvider'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Navbar(){
    const auth = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    function handleExit(){
        setIsMenuOpen(false)
        auth.logout()
        router.replace('/login')
    }

    return (
        <div className={styles.header}>
            <Link className={styles.brand} href="/" aria-label="MovieExplorer — главная">
                <span className={styles.logo} aria-hidden="true">M</span>
                MovieExplorer
            </Link>
            <nav className={styles.nav} aria-label="Основная навигация">
                <Link className={`${styles.link} ${pathname.startsWith('/movies') ? styles.active : ''}`} href="/movies" aria-current={pathname.startsWith('/movies') ? 'page' : undefined}>Фильмы</Link>
                <Link className={`${styles.link} ${pathname.startsWith('/users') ? styles.active : ''}`} href="/users" aria-current={pathname.startsWith('/users') ? 'page' : undefined}>Коллекции</Link>
            </nav>
            <div className={styles.loginNav}>
                {!auth.token ? (
                    <>
                        <Link className={styles.link} href="/login">Войти</Link>
                        <Link className={styles.register} href="/registration">Регистрация</Link>
                    </>
                ) : (
                    <div className={styles.dropdown}
                        onBlur={(event) => {
                            if (!event.currentTarget.contains(event.relatedTarget)) setIsMenuOpen(false)
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Escape') setIsMenuOpen(false)
                        }}>
                        <button className={styles.user} onClick={() => setIsMenuOpen(!isMenuOpen)} aria-expanded={isMenuOpen} aria-controls="account-menu">
                            <span className={styles.avatar}>{auth.user?.login.slice(0, 1).toUpperCase()}</span>
                            <span className={styles.username}>{auth.user?.login}</span>
                            <span aria-hidden="true">⌄</span>
                        </button>
                        {isMenuOpen && (
                            <div className={styles.dropdownContent} id="account-menu">
                                <Link href="/profile" onClick={() => setIsMenuOpen(false)}>Профиль</Link>
                                <Link href="/settings" onClick={() => setIsMenuOpen(false)}>Настройки</Link>
                                <button onClick={handleExit}>Выйти</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
