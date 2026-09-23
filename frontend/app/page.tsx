import Link from 'next/link'
import Image from 'next/image'
import styles from './Home.module.css'

export default function HomePage() {
    return (
        <div className={styles.homePage}>
            <section className={styles.hero}>
                <div>
                    <p className={styles.eyebrow}>ВАШ ЛИЧНЫЙ КИНОКАТАЛОГ</p>
                    <h1>Хорошее кино.<br /><span>В вашей коллекции.</span></h1>
                    <p className={styles.description}>Находите фильмы под настроение, сохраняйте любимое и открывайте коллекции других зрителей.</p>
                    <div className={styles.actions}>
                        <Link href="/movies" className={styles.primaryButton}>Найти фильм <span aria-hidden="true">→</span></Link>
                        <Link href="/users" className={styles.secondaryButton}>Коллекции зрителей</Link>
                    </div>
                    <p className={styles.note}>От первого поиска до любимого фильма.</p>
                </div>
                <div className={styles.posters} aria-hidden="true">
                    <Image className={styles.poster} src="https://avatars.mds.yandex.net/get-kinopoisk-image/1704946/be4b776a-5ab6-42b4-9147-5c3ec6b53c44/600x900" width={240} height={360} sizes="(max-width: 700px) 40vw, 240px" alt="" />
                    <Image className={styles.poster} src="https://avatars.mds.yandex.net/get-ott/224348/2a00000198528f853134273ea785844e1c8a/600x900" width={240} height={360} sizes="(max-width: 700px) 40vw, 240px" alt="" />
                </div>
            </section>
            <section className={styles.features} aria-label="Возможности MovieExplorer">
                <article className={styles.featureCard}>
                    <span className={styles.featureIcon} aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                            <circle cx="10.5" cy="10.5" r="6.5" />
                            <path d="m16 16 5 5" />
                        </svg>
                    </span>
                    <span className={styles.featureNumber}>01 / НАХОДИТЕ</span>
                    <h2>Следующий любимый фильм</h2>
                    <p>Поиск по названию, описание и рейтинг — всё, чтобы выбрать кино на вечер.</p>
                </article>
                <article className={styles.featureCard}>
                    <span className={styles.featureIcon} aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                            <path d="M6 4h12v17l-6-4-6 4V4Z" />
                        </svg>
                    </span>
                    <span className={styles.featureNumber}>02 / СОХРАНЯЙТЕ</span>
                    <h2>Коллекция с вашим характером</h2>
                    <p>Добавляйте фильмы в избранное, чтобы они всегда были под рукой.</p>
                </article>
                <article className={styles.featureCard}>
                    <span className={styles.featureIcon} aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" rx="1.5" />
                            <rect x="14" y="3" width="7" height="7" rx="1.5" />
                            <rect x="3" y="14" width="7" height="7" rx="1.5" />
                            <path d="M14 17.5h7m-3.5-3.5v7" />
                        </svg>
                    </span>
                    <span className={styles.featureNumber}>03 / ОТКРЫВАЙТЕ</span>
                    <h2>Кино глазами других</h2>
                    <p>Заглядывайте в коллекции зрителей и находите то, что могли пропустить.</p>
                </article>
            </section>
        </div>
    )
}
