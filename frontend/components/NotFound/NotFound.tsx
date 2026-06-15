import Link from 'next/link'
import styles from './NotFound.module.css'

export default function NotFound() {
    return (
        <div className={styles.notFoundPage}>
            <div className={styles.card}>
                <h1>404</h1>

                <h2>Странрица не найдена</h2>

                <p className={styles.description}>
                    Возможно, страница была удалена или вы перешли по неверной ссылке.
                </p>

                <div className={styles.buttons}>
                    <Link className={styles.linkButton} href="/movies">
                        Список фильмов
                    </Link>

                    <Link className={styles.secondaryButton} href="/users">
                        Список пользователей
                    </Link>
                </div>
            </div>
        </div>
    )
}