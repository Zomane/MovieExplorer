import styles from './Footer.module.css'

export default async function Footer() {
    return (
        <div className={styles.footer}>
            <p>Links:</p>
            <div>
                <a target='_blank' className={styles.link} href='https://x.com/goodwaitik'>x.com/goodwaitik</a>
            </div>
            <div>
                <a target='_blank' className={styles.link} href='https://t.me/peredoz1111'>t.me/peredoz1111</a>
            </div>
            <div>
                <a target='_blank' className={styles.link} href='https://github.com/Zomane'>github.com/Zomane</a>
            </div>
        </div>
    )
}