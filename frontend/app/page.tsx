import Link from 'next/link'
import styles from './Home.module.css'

export default function HomePage() {
    return (
        <main className={styles.homePage}>
            <section className={styles.hero}>
                <h1>MovieExplorer</h1>
                <h2>Персональный каталог фильмов</h2>
                <p className={styles.description}>Ищите фильмы, сохраняйте понравившиеся в личный список и открывайте подборки других пользователей</p>
                <div className={styles.actions}>
                    <Link href="/movies" className={styles.primaryButton}>Смотреть фильмы</Link>
                    <Link href="/users" className={styles.secondaryButton}>Список пользователей</Link>
                </div>
            </section>

            <section className={styles.features}>
                <article className={styles.featureCard}>
                    <span className={styles.featureIcon}>🔎</span>
                    <h3>Умный поиск</h3>
                    <p>Ищите фильмы по названию без перезагрузки страницы</p>
                </article>

                <article className={styles.featureCard}>
                    <span className={styles.featureIcon}>⭐</span>
                    <h3>Избранное</h3>
                    <p>Добавляйте фильмы в личную коллекцию и возвращайтесь к ним позже</p>
                </article>

                <article className={styles.featureCard}>
                    <span className={styles.featureIcon}>👤</span>
                    <h3>Профили</h3>
                    <p>Открывайте страницы пользователей и смотрите их сохранённые фильмы</p>
                </article>
            </section>
        </main>
    )
}