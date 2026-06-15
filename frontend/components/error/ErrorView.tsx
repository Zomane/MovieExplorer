import styles from './ErrorView.module.css'

type Props = {
    error: Error & { digest?: string }
    reset: () => void
}

export default function ErrorView({ error, reset }: Props) {
    return (
        <div className={styles.errorPage}>
            <div className={styles.errorCard}>
                <h1>Что-то пошло не так</h1>
                <p className={styles.errorMessage}>{error.message || 'Не удалось загрузить данные'}</p>

                <button className={styles.retryButton} onClick={reset}>Попробовать снова</button>
            </div>
        </div>
    )
}