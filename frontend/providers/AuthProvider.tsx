import { User } from "@/types/userType";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type AuthContextType = {
    user: User | null,
    token: string | null,
    login: (token: string, user: User) => void,
    logout: () => void,
    updateUser: (updatedUser: User) => void,
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({children}: {children: React.ReactNode}){
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const rawUser = localStorage.getItem('user')
        const rawToken = localStorage.getItem('token')

        if (rawUser) {
            setUser(JSON.parse(rawUser))
        }

        if (rawToken) {
            setToken(rawToken)
        }
    }, [])

    function login(token: string, user: User){
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        setToken(token)
        setUser(user)
    }

    function logout(){
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    function updateUser(updatedUser: User){
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
    }

    return (
        <AuthContext.Provider value={{user, token, login, logout, updateUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const auth = useContext(AuthContext)
    if(!auth){throw new Error('Context вызван все Auth')}
    return auth
}