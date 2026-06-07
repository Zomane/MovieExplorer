'use client'

import Link from 'next/link'
import styles from './Navbar.module.css'
import Image from 'next/image'

export default function Navbar(){
    return (
        <div className={styles.header}>
            <div className={styles.nav}>
                <Image src="/logo.png" alt='logo' width={50} height={50} className={styles.logo}/>
                <Link className={styles.link} href='/movies'>Список фильмов</Link>
                <Link className={styles.link} href='/users'>Пользователи</Link>
            </div>
            <div className={styles.loginNav}>
                <Link className={styles.link} href='/login'>Вход</Link>
                <Link className={styles.link} href='/registration'>Регистрация</Link>
                <Link className={styles.link} href='/profile'>Профиль</Link>
            </div>
        </div>
    )
}