export type UserEntity = {
    id: string
    login: string
    pass: string
    role: 'user' | 'admin'
    email: string
    savedMovieIds: string[]
}
export type JwtPayload = {
    id: string, 
    login: string,
    role: 'user' | 'admin'
} 