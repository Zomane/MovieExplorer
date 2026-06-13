import { User } from "@/types/userType";
import styles from './UserCard.module.css'
import Image from "next/image";

type Params = {
    user: User;
    onNavigate: (id: string) => void
}

// const UserCard = React.memo(

function UserCard({user, onNavigate}: Params) {
    const shortLogin = user.login.length > 15 ? user.login.slice(0, 15) + '...' : user.login
    return (
        <div className={styles.userCard}>
            <Image className={styles.userLogo} src='/userLogo.png' width={80} height={80} alt="user logo" />
            <h2 title={user.login}>{shortLogin}</h2>
            <p className={styles.savedCount}>Сохранено фильмов: {user.savedMovieIds?.length ?? 0}</p>
            <button className={styles.navButton} onClick={() => onNavigate(user.id)}>Перейти</button>
        </div>
    )
}

export default UserCard