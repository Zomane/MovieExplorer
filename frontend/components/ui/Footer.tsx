import styles from './Footer.module.css'

export default function Footer() {
    return (
        <div className={styles.footer}>
            <div>
                <p className={styles.brand}>MovieExplorer</p>
                <p>Хорошее кино всегда рядом.</p>
            </div>
            <div className={styles.links}>
                <a target="_blank" rel="noreferrer" href="https://x.com/goodwaitik">X ↗</a>
                <a target="_blank" rel="noreferrer" href="https://t.me/peredoz1111">Telegram ↗</a>
                <a target="_blank" rel="noreferrer" href="https://github.com/Zomane">GitHub ↗</a>
            </div>
        </div>
    )
}
