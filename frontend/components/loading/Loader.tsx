import styles from './Loader.module.css'

export default function Loader({cards = false}: {cards?: boolean}){
    return (
        <div className={styles.loadingPage} role="status">
            <p>Загрузка...</p>
            {cards && (
                <div className={styles.skeletonGrid} aria-hidden="true">
                    {[1, 2, 3, 4].map(item => (
                        <div className={styles.skeletonCard} key={item}>
                            <div className={styles.poster}></div>
                            <div className={styles.line}></div>
                            <div className={styles.line}></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
