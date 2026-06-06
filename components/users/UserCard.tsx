import { User } from "@/types/user";
import React from "react";

type Params = {
    user: User;
    onNavigate: (id: string) => void
}

const UserCard = React.memo(function UserCard({user, onNavigate}: Params) {
    return (
        <div>
            <h3>{user.login}</h3>
            <button onClick={() => onNavigate(user.id)}>Перейти</button>
        </div>
    )
})

export default UserCard