import styles from './Footer.module.css'
import Image from 'next/image'


export default async function Footer() {
    return (
        <div className={styles.footer}>
            <div className={styles.linkArea}>
                <Image src='/twitter.png' width={30} height={30} alt='github logo' /> 
                <a target='_blank' className={styles.link} href='https://x.com/goodwaitik'>x.com/goodwaitik</a>
            </div>
            <div className={styles.linkArea}>
                <Image src='/telegram.png' width={30} height={30} alt='github logo' /> 
                <a target='_blank' className={styles.link} href='https://t.me/peredoz1111'>t.me/peredoz1111</a>
            </div>
            <div className={styles.linkArea}>
                <Image src='/github.png' width={30} height={30} alt='github logo' /> 
                <a target='_blank' className={styles.link} href='https://github.com/Zomane'>github.com/Zomane</a>
            </div>
        </div>
    )
}